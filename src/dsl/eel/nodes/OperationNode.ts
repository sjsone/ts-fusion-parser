import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class OperationNode extends AbstractNode {
    public leftHand: AbstractNode
    public operation: string
    public rightHand: AbstractNode

    public constructor(leftHand: AbstractNode, operation: string, rightHand: AbstractNode, position: NodePositionInterface) {
        super(position)
        this.leftHand = leftHand
        this.leftHand["parent"] = this
        this.rightHand = rightHand
        this.rightHand["parent"] = this
        this.operation = operation
        this.position = position
    }
}
