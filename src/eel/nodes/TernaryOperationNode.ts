import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class TernaryOperationNode extends AbstractNode {
    public thenPart: AbstractNode
    public condition: AbstractNode
    public elsePart: AbstractNode

    public constructor(condition: AbstractNode, thenPart: AbstractNode, elsePart: AbstractNode, position: NodePosition) {
        super(position)
        this.thenPart = thenPart
        this.thenPart["parent"] = this
        this.elsePart = elsePart
        this.elsePart["parent"] = this
        this.condition = condition
        this.condition["parent"] = this
        this.position = position
    }
}
