import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class OperationNode extends AbstractNode {
    public leftHand: AbstractNode
    public operation: string
    public rightHand: AbstractNode

    public constructor(leftHand: AbstractNode, operation: string, rightHand: AbstractNode, position: NodePosition) {
        super(position)
        this.leftHand = leftHand
        this.rightHand = rightHand
        this.operation = operation
        this.position = position
    }
}
