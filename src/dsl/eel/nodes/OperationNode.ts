import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";

export class OperationNode extends EelNode {
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

    public toString(intend?: number): string {
        return this.leftHand.toString() + ` ${this.operation} ` + this.rightHand.toString()
    }
}
