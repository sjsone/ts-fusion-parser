import { AbstractNode } from "../../common/AbstractNode";
import { NodePositionInterface } from "../../common/NodePositionInterface";
import { ParserHandoverResult, ParserInterface } from "../parserInterface";
import { DocLexer } from "./lexer";
import { SingleLineDocumentationNode } from "./nodes/SingleLineDocumentationNode";
import { TypeDefinitionNode } from "./nodes/TypeDefinitionNode";
import { AnyCharacterToken, LeftParenthesisToken, RightParenthesisToken, SingleLineBeginToken, TokenConstructor, TypeBeginToken, TypeEndToken, TypeOrToken, TypesArrayOffset, TypesFqcn, TypesGenericBeginToken, TypesGenericEndToken, TypesName, WhitespaceToken } from "./tokens";

type SingleValueDocumentationType = { value: string, isArray: boolean, generics?: DocumentationType[] }
type MultipleValueDocumentationType = { types: DocumentationType[], isArray: boolean }
type DocumentationType = SingleValueDocumentationType | MultipleValueDocumentationType

export class DocParser implements ParserInterface {
    protected lexer: DocLexer
    public nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()
    public positionOffset: number

    constructor(lexer: DocLexer, positionOffset: number = 0) {
        this.lexer = lexer
        this.positionOffset = positionOffset
    }

    parseSingleLine() {
        this.parseLazyWhitespace()
        const position = this.beginPosition()
        let typeDefinition: TypeDefinitionNode | undefined = undefined

        this.lexer.lazyConsume(SingleLineBeginToken)

        if (this.lexer.lookAhead(TypeBeginToken)) {
            this.lexer.consumeLookAhead()
            this.parseLazyWhitespace()
            typeDefinition = this.parseTypeDefinition()
            this.parseLazyWhitespace()
            this.lexer.lazyConsume(TypeEndToken)
            this.parseLazyWhitespace()
        }

        this.parseLazyWhitespace()
        this.lexer.debug()


        const text = this.parseText()
        console.log("text", text)
        return new SingleLineDocumentationNode(this.endPosition(position))
    }

    protected parseTypeDefinition(): TypeDefinitionNode {
        const position = this.beginPosition()
        const types = this.parseTypeList(TypeEndToken)

        console.log("types", ...types)

        return new TypeDefinitionNode(this.endPosition(position))
    }

    protected parseTypeList(endToken: TokenConstructor) {
        const types: DocumentationType[] = []
        let runAway = 0
        while (runAway++ < 10 && (!this.lexer.lookAhead(endToken))) {
            // console.log("")

            types.push(this.parseSingleType())
            this.parseLazyWhitespace()

            if (!this.lexer.lookAhead(endToken)) {
                if (!this.lexer.lazyConsume(TypeOrToken)) {
                    throw new Error("Expected  | ")
                }
            }
            this.parseLazyWhitespace()
        }
        return types
    }

    protected parseSingleType(): DocumentationType {
        if (
            this.lexer.lookAhead(TypesName)
            || this.lexer.lookAhead(TypesFqcn)
        ) {
            const value = this.lexer.consumeLookAhead().value

            let generics
            if (this.lexer.lazyConsume(TypesGenericBeginToken)) {
                generics = this.parseTypeList(TypesGenericEndToken)
                this.lexer.lazyConsume(TypesGenericEndToken)
            }

            const isArray = Boolean(this.lexer.lazyConsume(TypesArrayOffset))
            return { value, isArray, generics }
        }

        if (this.lexer.lookAhead(LeftParenthesisToken)) {
            this.lexer.consumeLookAhead()
            const types = this.parseTypeList(RightParenthesisToken)

            this.lexer.lazyConsume(RightParenthesisToken)
            const isArray = Boolean(this.lexer.lazyConsume(TypesArrayOffset))
            return { types, isArray }
        }

        throw new Error("Unknown type")
    }

    protected parseText() {
        let text = ''
        let runAway = 0
        while (runAway++ < 1000 && this.lexer.lookAhead(AnyCharacterToken)) {
            text += this.lexer.consumeLookAhead().value
        }
        return text
    }

    setPositionOffset(positionOffset: number) {
        this.positionOffset = positionOffset
    }

    protected parseLazyWhitespace() {
        this.lexer.lazyConsume(WhitespaceToken)
    }

    protected applyOffset(position: NodePositionInterface) {
        if (position.begin !== -1) position.begin += this.positionOffset
        if (position.end !== -1) position.end += this.positionOffset
        return position
    }

    protected beginPosition(): NodePositionInterface {
        return { begin: this.lexer.getCursor(), end: -1 }
    }

    protected endPosition(position: NodePositionInterface) {
        position.end = this.lexer.getCursor()
        return this.applyOffset(position)
    }






    handover<T extends AbstractNode>(parser: ParserInterface): T | T[] {
        throw new Error("Method not implemented.");
    }
    receiveHandover<T extends AbstractNode>(text: string, offset: number): ParserHandoverResult<T> {
        throw new Error("Method not implemented.");
    }

}