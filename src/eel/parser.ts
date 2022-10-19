import { Lexer } from "./lexer";
import { AbstractNode } from "./nodes/AbstractNode";
import { BlockExpressionNode } from "./nodes/BlockExpressionNode";
import { LiteralArrayNode } from "./nodes/LiteralArrayNode";
import { LiteralNumberNode } from "./nodes/LiteralNumberNode";
import { LiteralObjectEntryNode } from "./nodes/LiteralObjectEntryNode";
import { LiteralObjectNode } from "./nodes/LiteralObjectNode";
import { LiteralStringNode } from "./nodes/LiteralStringNode";
import { NotOperationNode } from "./nodes/NotOperationNode";
import { ObjectFunctionPathNode } from "./nodes/ObjectFunctionPathNode";
import { ObjectNode } from "./nodes/ObjectNode";
import { ObjectOffsetAccessPathNode } from "./nodes/ObjectOffsetAccessPathNode";
import { ObjectPathNode } from "./nodes/ObjectPathNode";
import { OperationNode } from "./nodes/OperationNode";
import { TernaryOperationNode } from "./nodes/TernaryOperationNode";

import { ParserHandoverResult, ParserInterface } from "../afx/parserInterface";
import { ColonToken, CommaToken, DotToken, ExclamationMarkToken, FloatToken, IntegerToken, IsEqualToken, IsNotEqualToken, LBraceToken, LBracketToken, LogicalAndToken, LogicalOrToken, LParenToken, ObjectFunctionPathPartToken, ObjectPathPartToken, PlusToken, QuestionMarkToken, RBraceToken, RBracketToken, RParenToken, StringDoubleQuotedToken, StringSingleQuotedToken, Token, WhitespaceToken } from "./tokens";

const PositionStub = { begin: -1, end: -1 }
export class Parser implements ParserInterface {
    protected lexer: Lexer
    public nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()

    constructor(lexer: Lexer) {
        this.lexer = lexer
    }

    parse() {
        this.parseLazyWhitespace()
        return this.parseExpression()
    }

    protected parseExpression(): any {
        let object: AbstractNode | null = null
        switch (true) {
            case this.lexer.lookAhead(ExclamationMarkToken):
                this.lexer.consumeLookAhead()
                object = new NotOperationNode(this.parseExpression(), PositionStub)
                break;

            case this.lexer.lookAhead(FloatToken):
            case this.lexer.lookAhead(IntegerToken):
                object = new LiteralNumberNode(this.lexer.consumeLookAhead().value, PositionStub)
                break;

            case this.lexer.lookAhead(LParenToken):
                this.lexer.consumeLookAhead()
                this.parseLazyWhitespace()
                object = new BlockExpressionNode(this.parseExpression(), PositionStub)
                this.parseLazyWhitespace()
                this.lexer.consume(RParenToken)
                break;

            case this.lexer.lookAhead(StringDoubleQuotedToken):
            case this.lexer.lookAhead(StringSingleQuotedToken):
                object = this.parseString()
                break;

            case this.lexer.lookAhead(ObjectFunctionPathPartToken):
            case this.lexer.lookAhead(ObjectPathPartToken):
                object = this.parseObjectExpression()
                break;

            case this.lexer.lookAhead(LBraceToken):
                object = this.parseObjectLiteral()
                break;

            case this.lexer.lookAhead(LBracketToken):
                object = this.parseArrayLiteral()
                break;
        }

        if (object === null) {
            this.lexer.debug()
            throw Error("parseExpression")
        }

        const operation = this.parseOperationIfPossible(object)
        return operation ?? object
    }

    protected parseOperationIfPossible(object: AbstractNode) {
        this.parseLazyWhitespace()

        let operationToken = null
        switch (true) {
            case this.lexer.lookAhead(LogicalAndToken):
            case this.lexer.lookAhead(LogicalOrToken):
            case this.lexer.lookAhead(IsEqualToken):
            case this.lexer.lookAhead(IsNotEqualToken):
            case this.lexer.lookAhead(PlusToken):
                operationToken = this.lexer.consumeLookAhead()
                break;
            case this.lexer.lookAhead(QuestionMarkToken):
                return this.parseTernaryOperation(object)
        }

        if (operationToken !== null) {
            this.parseLazyWhitespace()
            return new OperationNode(
                object,
                operationToken.value,
                this.parseExpression(),
                PositionStub
            )
        }

        return null
    }

    protected parseTernaryOperation(object: AbstractNode) {
        this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()
        const thenPart = this.parseExpression()
        this.parseLazyWhitespace()
        this.lexer.consume(ColonToken)
        this.parseLazyWhitespace()
        const elsePart = this.parseExpression()
        return new TernaryOperationNode(object, thenPart, elsePart, PositionStub)
    }

    protected parseString() {
        switch (true) {
            case this.lexer.lookAhead(StringDoubleQuotedToken):
            case this.lexer.lookAhead(StringSingleQuotedToken):
                return new LiteralStringNode(this.lexer.consumeLookAhead().value, PositionStub)
        }
        this.lexer.debug()
        throw Error("parseString")
    }

    protected parseObjectExpression() {
        const rootPart = this.parseObjectExpressionPart()
        const parts = [rootPart]
        while (this.lexer.lazyConsume(DotToken)) {
            parts.push(this.parseObjectExpressionPart())
        }
        return new ObjectNode(parts, PositionStub)
    }

    protected parseObjectExpressionPart(): any {
        switch (true) {
            case this.lexer.lookAhead(ObjectFunctionPathPartToken):
                return this.parseObjectFunctionExpressionPart()
            case this.lexer.lookAhead(ObjectPathPartToken):
                return this.parseObjectPath()
        }
        this.lexer.debug()
        throw new Error("parseObjectExpressionPart")
    }

    protected parseObjectFunctionExpressionPart() {
        const base = this.lexer.consumeLookAhead()
        const args = []
        this.parseLazyWhitespace()

        if (!this.lexer.lookAhead(RParenToken)) {
            do {
                this.parseLazyWhitespace()
                args.push(this.parseExpression())
            } while (this.lexer.lazyConsume(CommaToken))
        }
        this.parseLazyWhitespace()
        this.lexer.consume(RParenToken)
        return new ObjectFunctionPathNode(base.value.slice(0, -1), args, PositionStub, this.parseObjectOffsetExpression())
    }

    protected parseObjectPath() {
        return new ObjectPathNode(this.lexer.consumeLookAhead().value, PositionStub, undefined, this.parseObjectOffsetExpression());
    }

    protected parseObjectOffsetExpression(): ObjectOffsetAccessPathNode | undefined {
        this.parseLazyWhitespace()
        if (!this.lexer.lookAhead(LBracketToken)) return undefined
        this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()
        const expression = this.parseExpression()
        this.parseLazyWhitespace()
        this.lexer.consume(RBracketToken)
        return new ObjectOffsetAccessPathNode(expression, PositionStub, this.parseObjectOffsetExpression())
    }

    protected parseObjectLiteral() {
        this.lexer.consumeLookAhead()
        const entries = []
        this.parseLazyWhitespace()

        if (!this.lexer.lookAhead(RBraceToken)) {
            do {
                this.parseLazyWhitespace()
                const key = this.parseString()
                this.parseLazyWhitespace()
                this.lexer.consume(ColonToken)
                this.parseLazyWhitespace()
                const value: any = this.parseExpression()
                entries.push(new LiteralObjectEntryNode(key, value, PositionStub))
            }
            while (this.lexer.lazyConsume(CommaToken))
        }

        this.parseLazyWhitespace()
        this.lexer.consume(RBraceToken)
        return new LiteralObjectNode(entries, PositionStub)
    }

    protected parseArrayLiteral() {
        this.lexer.consumeLookAhead()
        const entries = []
        this.parseLazyWhitespace()
        if (!this.lexer.lookAhead(RBracketToken)) {
            do {
                this.parseLazyWhitespace()
                entries.push(this.parseExpression())
                this.parseLazyWhitespace()
            } while (this.lexer.lazyConsume(CommaToken))
            this.parseLazyWhitespace()
        }
        this.lexer.consume(RBracketToken)
        return new LiteralArrayNode(entries, PositionStub)
    }

    protected parseLazyWhitespace() {
        this.lexer.lazyConsume(WhitespaceToken)
    }

    public handover<T extends AbstractNode>(parser: ParserInterface): T | Array<T> {
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