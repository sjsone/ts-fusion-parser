import { Lexer } from "./lexer";
import { AbstractNode } from "./nodes/AbstractNode";
import { NodePosition } from "./nodes/NodePosition";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode } from "./nodes/TagNode";
import { TextNode } from "./nodes/TextNode";
import { ParserHandoverResult, ParserInterface } from "./parserInterface";
import { AttributeNameToken, AttributeStringValueToken, AttributeValueAssignToken, CharacterToken, CommentToken, EscapedCharacterToken, TagBeginToken, TagCloseToken, TagEndToken, TagSelfCloseToken, TokenConstructor, WhitespaceToken, WordToken } from "./tokens";

export class Parser implements ParserInterface {
    protected lexer: Lexer

    constructor(lexer: Lexer) {
        this.lexer = lexer
    }

    parse() {
        return this.parseTextsOrTags(false, true)
    }

    parseText(debug: boolean = false) {
        if (debug) console.group("Parsing Text")
        const position: NodePosition = { begin: -1, end: -1 }
        let text = ""
        while (!this.lexer.isEOF() && (this.lexer.lookAhead(CharacterToken) || this.lexer.lookAhead(EscapedCharacterToken))) {
            const charToken = this.lexer.consumeLookAhead()
            text += charToken.value
            if (position.begin === -1) position.begin = charToken.position.begin
            position.end = charToken.position.end
        }
        if (debug) console.log("Found >>::" + text)
        if (debug) console.groupEnd()
        return new TextNode(position, text)
    }

    parseTextsOrTags(debugText: boolean = false, debugTag: boolean = false) {
        const elements = []
        // if(debugText || debugTag) console.group("Parsing texts or tags")
        while (!this.lexer.isEOF()) {
            this.parseLazyWhitespace()
            // if(debugTag) this.logRemaining(10)
            switch (true) {
                case this.lexer.lookAhead(CharacterToken):
                    elements.push(this.parseText(debugText))
                    break
                case this.lexer.lookAhead(TagBeginToken):
                    elements.push(this.parseTag(debugTag))
                    break
                case this.lexer.lookAhead(CommentToken):
                    this.parseComment()
                    break;
                default:
                    // if(debugText || debugTag) console.groupEnd()
                    return elements
            }
        }
        // if(debugText || debugTag) console.groupEnd()
        return elements
    }

    parseComment() {
        console.group("Parsing Comment")
        this.lexer.consume(CommentToken)
        console.groupEnd()
    }

    parseTag(debug: boolean = false) {
        if (debug) console.group("Parsing tag")
        const token = this.lexer.consume(TagBeginToken)
        const nameNode = TagNameNode.From(token)
        if (debug) console.log("Name", nameNode.toString(), token.position, nameNode["position"])
        const position = {...token.position}
        this.parseLazyWhitespace()

        const attributes: TagAttributeNode[] = []
        while (!this.lexer.lookAhead(TagCloseToken) && !this.lexer.lookAhead(TagSelfCloseToken)) {
            this.parseLazyWhitespace()
            const attribute = this.parseTagAttribute()
            attributes.push(attribute)
            if (debug) console.log("Attribute", attribute.name, attribute.value)
            this.parseLazyWhitespace()
        }

        const endToken = this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()

        if (endToken instanceof TagSelfCloseToken) {
            position.end = endToken.position.end
            if (debug) console.groupEnd()
            return new TagNode(position, nameNode.toString(), nameNode, attributes, TagNameNode.From(endToken), true)
        }
        this.parseTextsOrTags(false, true)
        this.parseLazyWhitespace()

        const closingTagToken = this.lexer.consume(TagEndToken)

        position.end = closingTagToken.position.end
        if (debug) console.log("Parsing tag finished: "+nameNode.toString())
        if (debug) console.groupEnd()
        return new TagNode(position, nameNode.toString(), nameNode, attributes, TagNameNode.From(closingTagToken))
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
                    break;
            }
        }
        // console.log(value)
        if (value) {
            position.end = value.position.end
        }
        return new TagAttributeNode(position, name.value, value ? value.value : null)
    }

    parseLazyWhitespace() {
        this.lexer.lazyConsume(WhitespaceToken)
    }

    public handover<T extends AbstractNode>(parser: ParserInterface): T|Array<T> {
        const result = parser.receiveHandover<T>(this.lexer.getRemainingText())
        this.lexer["cursor"] += result.cursor
        return result.nodeOrNodes
    }

    public receiveHandover<T extends AbstractNode>(text: string): ParserHandoverResult<T> {
        const currentLexer = this.lexer
        this.lexer = new Lexer(text)
        const nodeOrNodes = this.parse()    
        const result = {
            nodeOrNodes: <any>nodeOrNodes,
            cursor: this.lexer["cursor"]
        }

        this.lexer = currentLexer
        return result
    }

    logRemaining(cap: number|undefined = undefined) {
        console.log(">>::"+this.lexer.getRemainingText().substring(0, cap))
    }
}