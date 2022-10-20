import { Lexer } from "./lexer";
import { AbstractNode } from "./nodes/AbstractNode";
import { NodePosition } from "./nodes/NodePosition";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode } from "./nodes/TagNode";
import { TextNode } from "./nodes/TextNode";
import { ParserHandoverResult, ParserInterface } from "./parserInterface";
import { AnyCharacterToken, AttributeEelBeginToken, AttributeEelEndToken, AttributeNameToken, AttributeStringValueToken, AttributeValueAssignToken, CharacterToken, CommentToken, EscapedCharacterToken, ScriptEndToken, TagBeginToken, TagCloseToken, TagEndToken, TagSelfCloseToken, Token, TokenConstructor, WhitespaceToken, WordToken } from "./tokens";
import { Parser as EelParser } from '../eel/parser'
import { Lexer as EelLexer } from '../eel/lexer'
export class Parser implements ParserInterface {
    protected lexer: Lexer
    public nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()
    public positionOffset: number

    constructor(lexer: Lexer, positionOffset: number = 0) {
        this.lexer = lexer
        this.positionOffset = positionOffset
    }

    protected applyOffset(position: NodePosition) {
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
        const position: NodePosition = { begin: -1, end: -1 }
        let text = ""

        while (!this.lexer.isEOF() && (this.lexer.lookAhead(CharacterToken) || this.lexer.lookAhead(EscapedCharacterToken))) {
            const charToken = this.lexer.consumeLookAhead()
            text += charToken.value
            if (position.begin === -1) position.begin = charToken.position.begin
            position.end = charToken.position.end
        }

        const inlineEel = this.parseInlineEelFromText(text, position, parent)
        const textNode = new TextNode(this.applyOffset(position), text, inlineEel, parent)
        this.addNodeToNodesByType(textNode)
        return textNode
    }

    parseInlineEelFromText(text: string, position: NodePosition, parent: AbstractNode | undefined = undefined) {
        const inlineEel: AbstractNode[] = []
        const beginToken = new AttributeEelBeginToken()
        const eelParser = new EelParser(new EelLexer(""))

        let cursor = 0
        let match: RegExpExecArray | null = null
        while (cursor < text.length) {
            const rest = text.substring(cursor)
            match = beginToken.regex.exec(rest)
            if (match === null) {
                cursor++
                continue
            }

            cursor += match[1].length
            const eelText = text.substring(cursor)

            const result = eelParser.receiveHandover<AbstractNode>(eelText, cursor + position.begin + this.positionOffset)
            this.addNodesFromHandoverResult(result, parent)
            cursor += result.cursor

            if (Array.isArray(result.nodeOrNodes)) {
                inlineEel.push(...result.nodeOrNodes)
            } else {
                inlineEel.push(result.nodeOrNodes)
            }
        }
        for (const eelNode of inlineEel) {
            eelNode["parent"] = parent
        }
        return inlineEel
    }

    parseJavascript(parent: AbstractNode | undefined = undefined) {
        let text = ""
        const position: NodePosition = { begin: -1, end: -1 }
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
                    this.parseComment()
                    break;
                default:
                    return elements
            }
        }
        return elements
    }

    parseComment() {
        this.lexer.consume(CommentToken)
    }

    parseTag(parent: AbstractNode | undefined = undefined) {
        const token = this.lexer.consume(TagBeginToken)
        const nameNode = TagNameNode.From(token)
        this.lexer.tagStack.push(nameNode.toString())
        const position = { ...token.position }
        this.parseLazyWhitespace()

        const attributes: TagAttributeNode[] = []
        while (!this.lexer.lookAhead(TagCloseToken) && !this.lexer.lookAhead(TagSelfCloseToken)) {
            this.parseLazyWhitespace()
            const attribute = this.parseTagAttribute()
            this.addNodeToNodesByType(attribute)
            attributes.push(attribute)
            this.parseLazyWhitespace()
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

        const content: Array<TagNode | TextNode> = isScript ? [this.parseJavascript()] : this.parseTextsOrTags()
        this.parseLazyWhitespace()

        const closingTagToken = this.lexer.consume(TagEndToken)

        position.end = closingTagToken.position.end
        this.lexer.tagStack.pop()
        return new TagNode(this.applyOffset(position), nameNode.toString(), nameNode, attributes, content, TagNameNode.From(closingTagToken), false, parent)
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
                    const eelParser = new EelParser(new EelLexer(""))
                    const result = this.handover<AbstractNode>(eelParser)
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

    public handover<T extends AbstractNode>(parser: ParserInterface, parent: AbstractNode | undefined = undefined): T | Array<T> {
        const text = this.lexer.getRemainingText()
        const result = parser.receiveHandover<T>(text, this.lexer["cursor"] + this.positionOffset)
        this.addNodesFromHandoverResult(result, parent)

        this.lexer["cursor"] += result.cursor
        return result.nodeOrNodes
    }

    protected addNodesFromHandoverResult<T extends AbstractNode>(result: ParserHandoverResult<T>, parent: AbstractNode | undefined = undefined) {
        for (const [type, nodes] of result.nodesByType.entries()) {
            const list = this.nodesByType.get(type) ?? []
            for (const node of nodes) {
                list.push(node)
                node["parent"] = parent
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
}