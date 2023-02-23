import { Lexer } from "./lexer";
import { AbstractNode } from "../../common/AbstractNode";
import { NodePositionInterface } from "../../common/NodePositionInterface";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode } from "./nodes/TagNode";
import { TextNode } from "./nodes/TextNode";
import { ParserHandoverResult, ParserInterface } from "../parserInterface";
import { AnyCharacterToken, AttributeEelBeginToken, AttributeEelEndToken, AttributeNameToken, AttributeStringValueToken, AttributeValueAssignToken, CharacterToken, CommentToken, EscapedCharacterToken, ScriptEndToken, TagBeginToken, TagCloseToken, TagEndToken, TagSelfCloseToken, WhitespaceToken, WordToken } from "./tokens";
import { EelParserOptions, Parser as EelParser } from '../eel/parser'
import { Lexer as EelLexer } from '../eel/lexer'
import { TagSpreadEelAttributeNode } from "./nodes/TagSpreadEelAttributeNode";
import { InlineEelNode } from "./nodes/InlineEelNode";
import { Comment } from "../../common/Comment";

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

    isTagNameExpectedToNotBeClosed(tagName: string) {
        return ["link", "meta", "input", "img"].includes(tagName)
    }

    parse() {
        return this.parseTextsOrTags()
    }

    parseText(parent: AbstractNode | undefined = undefined) {
        const position: NodePositionInterface = { begin: -1, end: -1 }
        let text = ""
        const inlineEel: any = []
        while (!this.lexer.isEOF() && (this.lexer.lookAhead(CharacterToken) || this.lexer.lookAhead(EscapedCharacterToken))) {
            const charToken = this.lexer.consumeLookAhead()
            if ((new AttributeEelBeginToken).regex.test(charToken.value)) {
                const eelBegin = charToken
                const eelParser = this.buildEelParser()
                const result = this.handover<AbstractNode>(eelParser)

                const eelEnd = this.lexer.consume(AttributeEelEndToken)
                const position = {
                    begin: eelBegin.position.begin,
                    end: eelEnd.position.end
                }
                const inlineEelNode = new InlineEelNode(position, result)
                this.addNodeToNodesByType(inlineEelNode)
                inlineEel.push(inlineEelNode)

                text += this.lexer.getSnippet(position.begin, position.end)
            } else {
                text += charToken.value
            }

            if (position.begin === -1) position.begin = charToken.position.begin
            position.end = charToken.position.end
        }


        const textNode = new TextNode(this.applyOffset(position), text, inlineEel, parent)
        this.addNodeToNodesByType(textNode)
        return textNode
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
        const textNode = new TextNode(this.applyOffset(position), text, undefined, parent)
        this.addNodeToNodesByType(textNode)
        return textNode
    }

    parseTextsOrTags(parent: AbstractNode | undefined = undefined) {
        const elements = []
        while (!this.lexer.isEOF()) {
            this.parseLazyWhitespace()
            switch (true) {
                case this.lexer.lookAhead(CharacterToken):
                    elements.push(this.parseText(parent))
                    break
                case this.lexer.lookAhead(TagBeginToken):
                    elements.push(this.parseTag(parent))
                    break
                case this.lexer.lookAhead(CommentToken):
                    const comment = this.parseComment()
                    if (comment) elements.push(comment)
                    break;
                default:
                    return elements
            }
        }
        return elements
    }

    parseComment() {
        const commentValueRegex = /^<!--([\w\W]*?)-->$/gm
        const token = this.lexer.consume(CommentToken)
        const commentValueRegexResult = commentValueRegex.exec(token.value)
        if (commentValueRegexResult) {
            const comment = new Comment(commentValueRegexResult[1], token.value.includes("\n"), '<!--', this.applyOffset(token.position))
            this.addNodeToNodesByType(comment)
            return comment
        }
        return undefined
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
            if (!this.options.allowUnclosedTags) throw error
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

        if (endToken instanceof TagSelfCloseToken || this.isTagNameExpectedToNotBeClosed(nameNode.toString())) {
            position.end = endToken.position.end
            this.lexer.tagStack.pop()
            const tagNode = new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, [], TagNameNode.From(endToken), true, parent)
            this.addNodeToNodesByType(tagNode)
            return tagNode
        }

        const isScript = nameNode.toString() === "script"

        const content: Array<TagNode | TextNode | Comment> = isScript ? [this.parseJavascript()] : this.parseTextsOrTags()
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
        return new TagSpreadEelAttributeNode(position, Array.isArray(result) ? result : [result])
    }

    parseTagAttribute() {
        this.parseLazyWhitespace()
        const name = this.lexer.consume(AttributeNameToken)
        const position = name.position
        let value: any
        if (this.lexer.lazyConsume(AttributeValueAssignToken)) {

            switch (true) {
                case this.lexer.lookAhead(WordToken):
                case this.lexer.lookAhead(AttributeStringValueToken):
                    value = this.lexer.consumeLookAhead()
                    break
                case this.lexer.lookAhead(AttributeEelBeginToken):
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