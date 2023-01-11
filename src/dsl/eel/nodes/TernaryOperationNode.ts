import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class TernaryOperationNode extends AbstractNode {
    public thenPart: AbstractNode
    public condition: AbstractNode
    public elsePart: AbstractNode

    public constructor(condition: AbstractNode, thenPart: AbstractNode, elsePart: AbstractNode, position: NodePositionInterface) {
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
