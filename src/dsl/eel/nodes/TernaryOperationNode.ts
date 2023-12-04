import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";

export class TernaryOperationNode extends EelNode {
    public thenPart: EelNode
    public condition: EelNode
    public elsePart: EelNode

    public constructor(condition: EelNode, thenPart: EelNode, elsePart: EelNode, position: NodePositionInterface) {
        super(position)
        this.thenPart = thenPart
        this.thenPart["parent"] = this
        this.elsePart = elsePart
        this.elsePart["parent"] = this
        this.condition = condition
        this.condition["parent"] = this
        this.position = position
    }

    public toString(intend?: number): string {
        return `${this.condition.toString()} ? ${this.thenPart.toString()} : ${this.elsePart.toString()}`
    }
}
