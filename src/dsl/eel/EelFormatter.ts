import { AbstractFormatter } from "../../common/AbstractFormatter";
import { AbstractNode } from "../../common/AbstractNode";
import { EelNodeVisitorInterface } from "./EelNodeVisitorInterface";
import { BlockExpressionNode } from "./nodes/BlockExpressionNode";
import { CallbackNode } from "./nodes/CallbackNode";
import { EmptyEelNode } from "./nodes/EmptyEelNode";
import { LiteralArrayNode } from "./nodes/LiteralArrayNode";
import { LiteralBooleanNode } from "./nodes/LiteralBooleanNode";
import { LiteralNullNode } from "./nodes/LiteralNullNode";
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
import { SpreadOperationNode } from "./nodes/SpreadOperationNode";
import { TernaryOperationNode } from "./nodes/TernaryOperationNode";

export class EelFormatter extends AbstractFormatter implements EelNodeVisitorInterface<string> {
    visitCallbackNode(callbackNode: CallbackNode) {
        return `${callbackNode["signature"]} ${callbackNode["body"].toString()}`
    }

    visitLiteralBooleanNode(literalBooleanNode: LiteralBooleanNode) {
        return literalBooleanNode["value"]
    }

    visitLiteralObjectEntryNode(literalObjectEntryNode: LiteralObjectEntryNode) {
        return `${this.visitAbstractNode(literalObjectEntryNode.key)}: ${this.visitAbstractNode(literalObjectEntryNode.value)}}`
    }

    visitNotOperationNode(notOperationNode: NotOperationNode) {
        return `!${this.visitAbstractNode(notOperationNode.node)}`
    }

    visitObjectOffsetAccessPathNode(objectOffsetAccessPathNode: ObjectOffsetAccessPathNode) {
        const stringifiedOffset = objectOffsetAccessPathNode.offset ? this.visitAbstractNode(objectOffsetAccessPathNode.offset) : ''
        return `[${this.visitAbstractNode(objectOffsetAccessPathNode.expression)}]` + stringifiedOffset
    }

    visitSpreadOperationNode(spreadOperationNode: SpreadOperationNode) {
        return '...' + this.visitAbstractNode(spreadOperationNode.node)
    }

    visitEmptyEelNode(emptyEelNode: EmptyEelNode) {
        return ''
    }

    visitLiteralNullNode(literalNullNode: LiteralNullNode) {
        return '' + literalNullNode.value
    }

    visitLiteralObjectNode(literalObjectNode: LiteralObjectNode) {
        return `{${literalObjectNode.entries.map(entry => this.visitAbstractNode(entry)).join(", ")}}`
    }

    visitObjectFunctionPathNode(objectFunctionPathNode: ObjectFunctionPathNode) {
        const name = objectFunctionPathNode["value"]
        const stringifiedOffset = objectFunctionPathNode.offset ? this.visitAbstractNode(objectFunctionPathNode.offset) : ''
        return `${name}(${objectFunctionPathNode.args.map(arg => this.visitAbstractNode(arg)).join(", ")})` + stringifiedOffset
    }

    visitObjectPathNode(objectPathNode: ObjectPathNode) {
        const stringifiedOffset = objectPathNode.offset ? this.visitAbstractNode(objectPathNode.offset) : ''
        return objectPathNode["value"] + stringifiedOffset
    }

    visitTernaryOperationNode(ternaryOperationNode: TernaryOperationNode) {
        return `${this.visitAbstractNode(ternaryOperationNode.condition)} ? ${this.visitAbstractNode(ternaryOperationNode.thenPart)} : ${this.visitAbstractNode(ternaryOperationNode.elsePart)}`
    }

    visitBlockExpressionNode(blockExpressionNode: BlockExpressionNode) {
        return `(${this.visitAbstractNode(blockExpressionNode.node)})`
    }

    visitLiteralArrayNode(literalArrayNode: LiteralArrayNode) {
        return `[${literalArrayNode.entries.map(entry => this.visitAbstractNode(entry)).join(", ")}]`
    }

    visitLiteralNumberNode(literalNumberNode: LiteralNumberNode) {
        return literalNumberNode.value
    }

    visitLiteralStringNode(literalStringNode: LiteralStringNode) {
        return literalStringNode["quotationType"] + literalStringNode["value"] + literalStringNode["quotationType"]
    }

    visitObjectNode(objectNode: ObjectNode) {
        return objectNode.path.map(part => this.visitAbstractNode(part)).join(".")
    }

    visitOperationNode(operationNode: OperationNode) {
        return this.visitAbstractNode(operationNode.leftHand) + ` ${operationNode.operation} ` + this.visitAbstractNode(operationNode.rightHand)
    }


    visitAbstractNode(abstractNode: AbstractNode): string {
        // if (abstractNode instanceof AbstractLiteralNode) return this.visitAbstractLiteralNode(abstractNode)
        if (abstractNode instanceof CallbackNode) return this.visitCallbackNode(abstractNode)
        if (abstractNode instanceof LiteralBooleanNode) return this.visitLiteralBooleanNode(abstractNode)
        if (abstractNode instanceof LiteralObjectEntryNode) return this.visitLiteralObjectEntryNode(abstractNode)
        if (abstractNode instanceof NotOperationNode) return this.visitNotOperationNode(abstractNode)
        if (abstractNode instanceof ObjectOffsetAccessPathNode) return this.visitObjectOffsetAccessPathNode(abstractNode)
        if (abstractNode instanceof SpreadOperationNode) return this.visitSpreadOperationNode(abstractNode)

        // if (abstractNode instanceof AbstractValueNode) return this.visitAbstractValueNode(abstractNode)
        if (abstractNode instanceof EmptyEelNode) return this.visitEmptyEelNode(abstractNode)
        if (abstractNode instanceof LiteralNullNode) return this.visitLiteralNullNode(abstractNode)
        if (abstractNode instanceof LiteralObjectNode) return this.visitLiteralObjectNode(abstractNode)
        if (abstractNode instanceof ObjectFunctionPathNode) return this.visitObjectFunctionPathNode(abstractNode)
        if (abstractNode instanceof ObjectPathNode) return this.visitObjectPathNode(abstractNode)
        if (abstractNode instanceof TernaryOperationNode) return this.visitTernaryOperationNode(abstractNode)

        if (abstractNode instanceof BlockExpressionNode) return this.visitBlockExpressionNode(abstractNode)
        if (abstractNode instanceof LiteralArrayNode) return this.visitLiteralArrayNode(abstractNode)
        if (abstractNode instanceof LiteralNumberNode) return this.visitLiteralNumberNode(abstractNode)
        if (abstractNode instanceof LiteralStringNode) return this.visitLiteralStringNode(abstractNode)
        if (abstractNode instanceof ObjectNode) return this.visitObjectNode(abstractNode)
        if (abstractNode instanceof OperationNode) return this.visitOperationNode(abstractNode)

        throw new Error(`Unknown AbstractNode ${abstractNode.constructor.name}`)
    }
}