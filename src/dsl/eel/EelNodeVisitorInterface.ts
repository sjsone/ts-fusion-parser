import { AbstractNode } from "../../common/AbstractNode";
import { NodeVisitorInterface } from "../../common/NodeVisitorInterface";
import { AbstractLiteralNode } from "./nodes/AbstractLiteralNode";
import { AbstractValueNode } from "./nodes/AbstractValueNode";
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

export interface EelNodeVisitorInterface<T> extends NodeVisitorInterface<T> {
    // visitAbstractLiteralNode(abstractLiteralNode: AbstractLiteralNode<AbstractNode>): T
    visitCallbackNode(callbackNode: CallbackNode): T
    visitLiteralBooleanNode(literalBooleanNode: LiteralBooleanNode): T
    visitLiteralObjectEntryNode(literalObjectEntryNode: LiteralObjectEntryNode): T
    visitNotOperationNode(notOperationNode: NotOperationNode): T
    visitObjectOffsetAccessPathNode(objectOffsetAccessPathNode: ObjectOffsetAccessPathNode): T
    visitSpreadOperationNode(spreadOperationNode: SpreadOperationNode): T
    // visitAbstractValueNode(abstractValueNode: AbstractValueNode<T>): T
    visitEmptyEelNode(emptyEelNode: EmptyEelNode): T
    visitLiteralNullNode(literalNullNode: LiteralNullNode): T
    visitLiteralObjectNode(literalObjectNode: LiteralObjectNode): T
    visitObjectFunctionPathNode(objectFunctionPathNode: ObjectFunctionPathNode): T
    visitObjectPathNode(objectPathNode: ObjectPathNode): T
    visitTernaryOperationNode(ternaryOperationNode: TernaryOperationNode): T
    visitBlockExpressionNode(blockExpressionNode: BlockExpressionNode): T
    visitLiteralArrayNode(literalArrayNode: LiteralArrayNode): T
    visitLiteralNumberNode(literalNumberNode: LiteralNumberNode): T
    visitLiteralStringNode(literalStringNode: LiteralStringNode): T
    visitObjectNode(objectNode: ObjectNode): T
    visitOperationNode(operationNode: OperationNode): T
}