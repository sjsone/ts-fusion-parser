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
import { CallbackSignatureToken, ColonToken, CommaToken, DivisionToken, DotToken, ExclamationMarkToken, FalseValueToken, FloatToken, IntegerToken, IsEqualToken, IsNotEqualToken, LBraceToken, LBracketToken, LessThanOrEqualToken, LessThanToken, LogicalAndToken, LogicalOrToken, LParenToken, MinusToken, ModuloToken, MoreThanOrEqualToken, MoreThanToken, MultiplicationToken, NullValueToken, ObjectFunctionPathPartToken, ObjectPathPartToken, PlusToken, QuestionMarkToken, RBraceToken, RBracketToken, RParenToken, SpreadToken, StringDoubleQuotedToken, StringSingleQuotedToken, Token, TrueValueToken, WhitespaceToken } from "./tokens";
import { NodePosition } from "./nodes/NodePosition";
import { SpreadOperationNode } from "./nodes/SpreadOperationNode";
import { LiteralBooleanNode } from "./nodes/LiteralBooleanNode";
import { LiteralNullNode } from "./nodes/LiteralNullNode";
import { CallbackNode } from "./nodes/CallbackNode";
export class Parser implements ParserInterface {
    protected lexer: Lexer
    public nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()

    public positionOffset: number

    constructor(lexer: Lexer, positionOffset: number = 0) {
        this.lexer = lexer
        this.positionOffset = positionOffset
    }

    setPositionOffset(positionOffset: number) {
        this.positionOffset = positionOffset
    }

    protected applyOffset(position: NodePosition) {
        if (position.begin !== -1) position.begin += this.positionOffset
        if (position.end !== -1) position.end += this.positionOffset
        return position
    }

    protected beginPosition(): NodePosition {
        return { begin: this.lexer.getCursor(), end: -1 }
    }

    protected endPosition(position: NodePosition) {
        position.end = this.lexer.getCursor()
        return this.applyOffset(position)
    }

    parse() {
        this.parseLazyWhitespace()
        return this.parseExpression()
    }

    protected parseExpression(parent: AbstractNode | undefined = undefined): any {
        let object: AbstractNode | null = null
        const position = this.beginPosition()
        switch (true) {
            case this.lexer.lookAhead(SpreadToken): 
                this.lexer.consumeLookAhead()
                object = new SpreadOperationNode(this.parseExpression(), this.endPosition(position), parent)
                break
            case this.lexer.lookAhead(ExclamationMarkToken):
                this.lexer.consumeLookAhead()
                object = new NotOperationNode(this.parseExpression(), this.endPosition(position), parent)
                break

            case this.lexer.lookAhead(FloatToken):
            case this.lexer.lookAhead(IntegerToken):
                object = new LiteralNumberNode(this.lexer.consumeLookAhead().value, this.endPosition(position), parent)
                break
            
            case this.lexer.lookAhead(TrueValueToken):
            case this.lexer.lookAhead(FalseValueToken):
                object = new LiteralBooleanNode(this.lexer.consumeLookAhead().value, this.endPosition(position), parent)
                break
            
            case this.lexer.lookAhead(NullValueToken):
                object = new LiteralNullNode(this.lexer.consumeLookAhead().value, this.endPosition(position), parent)
                break

            case this.lexer.lookAhead(CallbackSignatureToken):
                const signature = this.lexer.consumeLookAhead()
                this.parseLazyWhitespace()
                const callbackBody = this.parseExpression()
                this.parseLazyWhitespace()
                object = new CallbackNode(signature.value, callbackBody, this.endPosition(position), parent)
                break

            case this.lexer.lookAhead(LParenToken):
                this.lexer.consumeLookAhead()
                this.parseLazyWhitespace()
                object = new BlockExpressionNode(this.parseExpression(), this.endPosition(position), parent)
                this.parseLazyWhitespace()
                this.lexer.consume(RParenToken)
                break;

            case this.lexer.lookAhead(StringDoubleQuotedToken):
            case this.lexer.lookAhead(StringSingleQuotedToken):
                object = this.parseString(parent)
                break;

            case this.lexer.lookAhead(ObjectFunctionPathPartToken):
            case this.lexer.lookAhead(ObjectPathPartToken):
                object = this.parseObjectExpression(parent)
                break;

            case this.lexer.lookAhead(LBraceToken):
                object = this.parseObjectLiteral(parent)
                break;

            case this.lexer.lookAhead(LBracketToken):
                object = this.parseArrayLiteral(parent)
                break;
        }

        if (object === null) {
            this.lexer.debug()
            throw Error("parseExpression")
        }

        this.addNodeToNodesByType(object)

        const operation = this.parseOperationIfPossible(object)
        if (operation) return this.addNodeToNodesByType(operation)
        return object
    }

    protected parseOperationIfPossible(object: AbstractNode) {
        this.parseLazyWhitespace()

        let operationToken = null
        const position = this.beginPosition()
        switch (true) {
            case this.lexer.lookAhead(LogicalAndToken):
            case this.lexer.lookAhead(LogicalOrToken):
            case this.lexer.lookAhead(IsEqualToken):
            case this.lexer.lookAhead(IsNotEqualToken):
            case this.lexer.lookAhead(PlusToken):
            case this.lexer.lookAhead(MinusToken):
            case this.lexer.lookAhead(MultiplicationToken):
            case this.lexer.lookAhead(DivisionToken):
            case this.lexer.lookAhead(ModuloToken):
            case this.lexer.lookAhead(LessThanOrEqualToken):
            case this.lexer.lookAhead(MoreThanOrEqualToken):
            case this.lexer.lookAhead(LessThanToken):
            case this.lexer.lookAhead(MoreThanToken):
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
                this.endPosition(position)
            )
        }

        return null
    }

    protected parseTernaryOperation(object: AbstractNode) {
        const position = this.beginPosition()
        this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()
        const thenPart = this.parseExpression()
        this.parseLazyWhitespace()
        this.lexer.consume(ColonToken)
        this.parseLazyWhitespace()
        const elsePart = this.parseExpression()
        return new TernaryOperationNode(object, thenPart, elsePart, this.endPosition(position))
    }

    protected parseString(parent: AbstractNode | undefined = undefined) {
        const position = this.beginPosition()
        switch (true) {
            case this.lexer.lookAhead(StringDoubleQuotedToken):
            case this.lexer.lookAhead(StringSingleQuotedToken):
                const stringNode = new LiteralStringNode(this.lexer.consumeLookAhead().value, this.endPosition(position), parent)
                return this.addNodeToNodesByType(stringNode)
        }
        this.lexer.debug()
        throw Error("parseString")
    }

    protected parseObjectExpression(parent: AbstractNode | undefined = undefined) {
        const position = this.beginPosition()
        const rootPart = this.parseObjectExpressionPart()
        this.addNodeToNodesByType(rootPart)
        const parts = [rootPart]
        while (this.lexer.lazyConsume(DotToken)) {
            parts.push(this.addNodeToNodesByType(this.parseObjectExpressionPart()))
        }
        return this.addNodeToNodesByType(new ObjectNode(parts, this.endPosition(position), parent))
    }

    protected parseObjectExpressionPart(): any {
        switch (true) {
            case this.lexer.lookAhead(ObjectPathPartToken):
                return this.parseObjectPath()
            case this.lexer.lookAhead(ObjectFunctionPathPartToken):
                return this.parseObjectFunctionExpressionPart()
            
        }
        this.lexer.debug()
        throw new Error("parseObjectExpressionPart")
    }

    protected parseObjectFunctionExpressionPart() {
        const position = this.beginPosition()
        const base = this.lexer.consumeLookAhead()
        const args = []
        this.parseLazyWhitespace()

        if (!this.lexer.lookAhead(RParenToken)) {
            do {
                this.parseLazyWhitespace()
                args.push(this.addNodeToNodesByType(this.parseExpression()))
            } while (this.lexer.lazyConsume(CommaToken))
        }
        this.parseLazyWhitespace()
        this.lexer.consume(RParenToken)

        const node = new ObjectFunctionPathNode(base.value.slice(0, -1), args, this.endPosition(position), this.parseObjectOffsetExpression())
        return this.addNodeToNodesByType(node)
    }

    protected parseObjectPath() {
        const position = this.beginPosition()
        const node = new ObjectPathNode(this.lexer.consumeLookAhead().value, this.endPosition(position), undefined, this.parseObjectOffsetExpression());
        return this.addNodeToNodesByType(node)
    }

    protected parseObjectOffsetExpression(): ObjectOffsetAccessPathNode | undefined {
        this.parseLazyWhitespace()
        if (!this.lexer.lookAhead(LBracketToken)) return undefined
        const position = this.beginPosition()
        this.lexer.consumeLookAhead()
        this.parseLazyWhitespace()
        const expression = this.parseExpression()
        this.parseLazyWhitespace()
        this.lexer.consume(RBracketToken)
        const node = new ObjectOffsetAccessPathNode(expression, this.endPosition(position), this.parseObjectOffsetExpression())
        return this.addNodeToNodesByType(node)
    }

    protected parseObjectLiteral(parent: AbstractNode | undefined = undefined) {
        const position = this.beginPosition()
        this.lexer.consumeLookAhead()
        const entries = []
        this.parseLazyWhitespace()

        if (!this.lexer.lookAhead(RBraceToken)) {
            do {
                this.parseLazyWhitespace()
                const key = this.parseObjectLiteralEntryKey()
                this.parseLazyWhitespace()
                this.lexer.consume(ColonToken)
                this.parseLazyWhitespace()
                const value: any = this.parseExpression()
                entries.push(this.addNodeToNodesByType(new LiteralObjectEntryNode(key, value, this.endPosition(position))))
            }
            while (this.lexer.lazyConsume(CommaToken))
        }

        this.parseLazyWhitespace()
        this.lexer.consume(RBraceToken)
        return this.addNodeToNodesByType(new LiteralObjectNode(entries, this.endPosition(position), parent))
    }

    protected parseObjectLiteralEntryKey() {
        switch (true) {
            case this.lexer.lookAhead(StringDoubleQuotedToken):
            case this.lexer.lookAhead(StringSingleQuotedToken):
                return this.parseString()
            case this.lexer.lookAhead(ObjectPathPartToken):
            default:
                return this.parseObjectPath()
        }
    }

    protected parseArrayLiteral(parent: AbstractNode | undefined = undefined) {
        const position = this.beginPosition()
        this.lexer.consumeLookAhead()
        const entries = []
        this.parseLazyWhitespace()
        if (!this.lexer.lookAhead(RBracketToken)) {
            do {
                this.parseLazyWhitespace()
                entries.push(this.addNodeToNodesByType(this.parseExpression()))
                this.parseLazyWhitespace()
            } while (this.lexer.lazyConsume(CommaToken))
            this.parseLazyWhitespace()
        }
        this.lexer.consume(RBracketToken)
        return this.addNodeToNodesByType(new LiteralArrayNode(entries, this.endPosition(position), parent))
    }

    protected parseLazyWhitespace() {
        this.lexer.lazyConsume(WhitespaceToken)
    }

    public handover<T extends AbstractNode>(parser: ParserInterface): T | Array<T> {
        const result = parser.receiveHandover<T>(this.lexer.getRemainingText(), this.lexer.getCursor() + this.positionOffset)
        this.lexer["cursor"] += result.cursor
        return result.nodeOrNodes
    }

    public receiveHandover<T extends AbstractNode>(text: string, offset: number): ParserHandoverResult<T> {
        const currentLexer = this.lexer
        const currentPositionOffset = this.positionOffset
        this.lexer = new Lexer(text)
        this.positionOffset = offset
        const nodeOrNodes = this.parse()
        const result = {
            nodeOrNodes: <any>nodeOrNodes,
            cursor: this.lexer["cursor"],
            nodesByType: <any>this.nodesByType
        }

        this.lexer = currentLexer
        this.positionOffset = currentPositionOffset
        return result
    }

    logRemaining(cap: number | undefined = undefined) {
        console.log(">>::" + this.lexer.getRemainingText().substring(0, cap))
    }

    protected addNodeToNodesByType<T extends AbstractNode>(node: T): T {
        const type = <typeof AbstractNode>node.constructor
        const list = this.nodesByType.get(type) ?? []
        // FIXME: Checking before pushing should not be necessary
        if(!list.includes(node)) list.push(node)
        this.nodesByType.set(type, list)
        return node
    }

    protected flushNodesByType() {
        const map = new Map(this.nodesByType)
        this.nodesByType.clear()
        return map
    }
}