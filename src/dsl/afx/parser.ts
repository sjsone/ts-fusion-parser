import { AbstractNode } from "../../common/AbstractNode";
import { Comment } from "../../common/Comment";
import { NodePositionInterface } from "../../common/NodePositionInterface";
import { ParserError } from "../../common/ParserError";
import { Lexer as EelLexer } from '../eel/lexer';
import { Parser as EelParser, EelParserOptions } from '../eel/parser';
import { ParserHandoverResult, ParserInterface } from "../parserInterface";
import { Lexer } from "./lexer";
import { InlineEelNode } from "./nodes/InlineEelNode";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode, type TagNodeContent } from "./nodes/TagNode";
import { TagSpreadEelAttributeNode } from "./nodes/TagSpreadEelAttributeNode";
import { TextNode } from "./nodes/TextNode";
import { AnyCharacterToken, AttributeEelBeginToken, AttributeEelEndToken, AttributeNameToken, AttributeStringValueToken, AttributeValueAssignToken, CharacterToken, CommentToken, EscapedCharacterToken, ScriptEndToken, TagBeginToken, TagCloseToken, TagEndToken, TagSelfCloseToken, WhitespaceToken, WordToken } from "./tokens";

export interface AfxParserOptions {
    allowUnclosedTags: boolean
    eelParserOptions?: EelParserOptions
}

export class Parser implements ParserInterface {
    protected lexer: Lexer
    public nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()
    public positionOffset: number

    protected options: AfxParserOptions = {
        allowUnclosedTags: false
    }

    constructor(lexer: Lexer, positionOffset: number = 0, options?: AfxParserOptions) {
        this.lexer = lexer
        this.positionOffset = positionOffset
        if (options) this.options = options
    }

    protected applyOffset(position: NodePositionInterface) {
        if (position.begin !== -1) position.begin += this.positionOffset
        if (position.end !== -1) position.end += this.positionOffset
        return position
    }

    parse() {
        return [...this.parseTextsOrTags()]
    }

    *parseText(parent: AbstractNode | undefined = undefined) {
        const position: NodePositionInterface = { begin: -1, end: -1 }
        let currentText: string = ''
        let currentTextPosition: NodePositionInterface = { begin: this.lexer.getCursor(), end: -1 }

        while (!this.lexer.isEOF() && (this.lexer.lookAhead(CharacterToken) || this.lexer.lookAhead(EscapedCharacterToken))) {
            const charToken = this.lexer.consumeLookAhead()
            if ((new AttributeEelBeginToken).regex.test(charToken.value)) {
                if (currentText !== '') {
                    currentTextPosition.end = this.lexer.getCursor() - 1
                    const textNode = new TextNode(this.applyOffset(currentTextPosition), currentText, parent)
                    this.addNodeToNodesByType(textNode)
                    yield textNode
                    currentTextPosition = { begin: this.lexer.getCursor(), end: -1 }
                    currentText = ''
                }
                const eelBegin = charToken
                const eelParser = this.buildEelParser()
                const result = this.handover<AbstractNode>(eelParser)

                const eelEnd = this.lexer.consume(AttributeEelEndToken)
                const position = {
                    begin: eelBegin.position.begin,
                    end: eelEnd.position.end
                }
                const inlineEelNode = new InlineEelNode(this.applyOffset(position), result)
                this.addNodeToNodesByType(inlineEelNode)
                yield inlineEelNode
            } else {
                currentText += charToken.value
            }

            if (position.begin === -1) position.begin = charToken.position.begin
            position.end = charToken.position.end
        }

        if (currentText !== '') {
            currentTextPosition.end = this.lexer.getCursor() - 1
            const textNode = new TextNode(this.applyOffset(currentTextPosition), currentText, parent)
            this.addNodeToNodesByType(textNode)
            yield textNode
        }
    }

    parseJavascript(parent: AbstractNode | undefined = undefined) {
        let text = ""
        const position: NodePositionInterface = { begin: -1, end: -1 }
        while (!this.lexer.isEOF() && !this.lexer.lookAhead(ScriptEndToken) && this.lexer.lookAhead(AnyCharacterToken)) {
            const charToken = this.lexer.consumeLookAhead()
            text += charToken.value
            if (position.begin === -1) position.begin = charToken.position.begin
            position.end = charToken.position.end
        }
        const textNode = new TextNode(this.applyOffset(position), text, parent)
        this.addNodeToNodesByType(textNode)
        return textNode
    }

    *parseTextsOrTags(parent: AbstractNode | undefined = undefined) {
        while (!this.lexer.isEOF()) {
            this.parseLazyWhitespace()
            switch (true) {
                case this.lexer.lookAhead(CharacterToken):
                    yield* this.parseText(parent)
                    break
                case this.lexer.lookAhead(TagBeginToken):
                    yield this.parseTag(parent)
                    break
                case this.lexer.lookAhead(CommentToken):
                    yield* this.parseComment()
                    break;
                default:
                    return
            }
        }
    }

    *parseComment() {
        const commentValueRegex = /^<!--([.]*?)-->$/gm
        const token = this.lexer.consume(CommentToken)
        const commentValueRegexResult = commentValueRegex.exec(token.value)
        if (commentValueRegexResult) {
            const comment = new Comment(commentValueRegexResult[1], token.value.includes("\n"), '<!--', this.applyOffset(token.position))
            this.addNodeToNodesByType(comment)
            yield comment
        }
    }

    parseTag(parent: AbstractNode | undefined = undefined) {
        const token = this.lexer.consume(TagBeginToken)
        const nameNode = TagNameNode.From(token)
        this.lexer.tagStack.push(<any>nameNode.toString())
        const position = { ...token.position }
        this.parseLazyWhitespace()

        const attributes: Array<TagSpreadEelAttributeNode | TagAttributeNode> = []

        try {
            while (!this.lexer.lookAhead(TagCloseToken) && !this.lexer.lookAhead(TagSelfCloseToken)) {
                this.parseLazyWhitespace()

                const isSpreadEelAttribute = this.lexer.lookAhead(AttributeEelBeginToken)
                const attribute = isSpreadEelAttribute ? this.parseSpreadEelAttribute() : this.parseTagAttribute()
                this.addNodeToNodesByType(attribute)
                attributes.push(attribute)
                this.parseLazyWhitespace()
            }
        } catch (error) {
            if (!this.options.allowUnclosedTags) {
                if (error instanceof Error) {
                    throw new ParserError(error.message, this.lexer.getCursor())
                } else throw error
            }
            const endToken = new TagSelfCloseToken()
            endToken["value"] = ">"
            endToken.position = {
                begin: position.begin + 1,
                end: position.end
            }
            position.end = endToken.position.end
            this.lexer.tagStack.pop()
            const tagNode = new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, [], TagNameNode.From(endToken), true, parent)
            tagNode["artificiallyClosed"] = true
            this.addNodeToNodesByType(tagNode)
            return tagNode
        }


        const endToken = this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()

        if (endToken instanceof TagSelfCloseToken) {
            position.end = endToken.position.end
            this.lexer.tagStack.pop()
            const tagNode = new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, [], TagNameNode.From(endToken), true, parent)
            this.addNodeToNodesByType(tagNode)
            return tagNode
        }

        const isScript = nameNode.toString() === "script"

        const content: TagNodeContent = isScript ? [this.parseJavascript()] : [...this.parseTextsOrTags()]
        this.parseLazyWhitespace()

        if (this.lexer.isEOF()) {
            const endToken = new TagSelfCloseToken()
            endToken["value"] = ">"
            endToken.position = {
                begin: position.end + 1,
                end: position.end + 2
            }
            position.end = endToken.position.end
            this.lexer.tagStack.pop()
            const endNode = TagNameNode.From(endToken)
            const tagNode = new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, [], endNode, true, parent)
            tagNode["artificiallyClosed"] = true
            this.addNodeToNodesByType(tagNode)
            return tagNode
        }

        const closingTagToken = this.lexer.consume(TagEndToken)

        position.end = closingTagToken.position.end
        closingTagToken.position = this.applyOffset(closingTagToken.position)
        this.lexer.tagStack.pop()
        const tagNode = new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, content, TagNameNode.From(closingTagToken), false, parent)
        this.addNodeToNodesByType(tagNode)
        return tagNode
    }

    parseSpreadEelAttribute() {
        const eelBegin = this.lexer.consumeLookAhead()
        const eelParser = this.buildEelParser()
        const result = this.handover<AbstractNode>(eelParser)
        const eelEnd = this.lexer.consume(AttributeEelEndToken)
        const position = {
            begin: eelBegin.position.begin,
            end: eelEnd.position.end
        }
        const eel = this.lexer.getSnippet(position.begin + 1, position.end - 1)
        return new TagSpreadEelAttributeNode(this.applyOffset(position), Array.isArray(result) ? result : [result], eel)
    }

    parseTagAttribute() {
        this.parseLazyWhitespace()
        // TODO: check if TagAttribute begins with `"`. If so, parse it as a string instead of using the token regex
        const name = this.lexer.consume(AttributeNameToken)
        const position = name.position
        let value: any
        if (this.lexer.lazyConsume(AttributeValueAssignToken)) {

            switch (true) {
                case this.lexer.lookAhead(WordToken):
                case this.lexer.lookAhead(AttributeStringValueToken):
                    value = this.lexer.consumeLookAhead()
                    break
                case this.lexer.lookAhead(AttributeEelBeginToken): {
                    const eelBegin = this.lexer.consumeLookAhead()

                    const eelParser = this.buildEelParser()
                    const result = this.handover<AbstractNode>(eelParser)
                    // console.log("result", result)
                    const eelEnd = this.lexer.consume(AttributeEelEndToken)

                    value = {
                        value: result, position: {
                            begin: eelBegin.position.begin,
                            end: eelEnd.position.end
                        }
                    }
                    break
                }
            }
        }

        if (value) {
            position.end = value.position.end
        }
        return new TagAttributeNode(this.applyOffset(position), name.value, value ? value.value : null)
    }

    parseLazyWhitespace() {
        this.lexer.lazyConsume(WhitespaceToken)
    }

    public handover<T extends AbstractNode>(parser: ParserInterface, parent: AbstractNode | undefined = undefined): Array<T> {
        const text = this.lexer.getRemainingText()
        const result = parser.receiveHandover<T>(text, this.lexer["cursor"] + this.positionOffset)
        this.addNodesFromHandoverResult(result, parent)

        this.lexer["cursor"] += result.cursor
        return Array.isArray(result.nodeOrNodes) ? result.nodeOrNodes : [result.nodeOrNodes]
    }

    protected addNodesFromHandoverResult<T extends AbstractNode>(result: ParserHandoverResult<T>, parent: AbstractNode | undefined = undefined) {
        if (Array.isArray(result.nodeOrNodes)) {
            for (const node of result.nodeOrNodes) {
                node["parent"] = parent
            }
        } else {
            result.nodeOrNodes["parent"] = parent
        }
        for (const [type, nodes] of result.nodesByType.entries()) {
            const list = this.nodesByType.get(type) ?? []
            for (const node of nodes) {
                list.push(node)
            }
            this.nodesByType.set(type, list)
        }
    }

    public receiveHandover<T extends AbstractNode>(text: string): ParserHandoverResult<T> {
        const currentLexer = this.lexer
        this.lexer = new Lexer(text)
        const nodeOrNodes = this.parse()

        const result = {
            nodeOrNodes: <any>nodeOrNodes,
            cursor: this.lexer["cursor"],
            nodesByType: <any>this.nodesByType
        }

        this.lexer = currentLexer
        return result
    }

    logRemaining(cap: number | undefined = undefined) {
        console.log(">>::" + this.lexer.getRemainingText().substring(0, cap))
    }

    protected addNodeToNodesByType(node: AbstractNode) {
        const type = <typeof AbstractNode>node.constructor
        const list = this.nodesByType.get(type) ?? []
        list.push(node)
        this.nodesByType.set(type, list)
    }

    protected flushNodesByType() {
        const map = new Map(this.nodesByType)
        this.nodesByType.clear()
        return map
    }

    protected buildEelParser() {
        return new EelParser(new EelLexer(""), undefined, this.options.eelParserOptions)
    }
}