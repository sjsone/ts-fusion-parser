import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class TernaryOperationNode extends AbstractNode {
    public thenPart: AbstractNode
    public condition: AbstractNode
    public elsePart: AbstractNode

    public constructor(condition: AbstractNode, thenPart: AbstractNode, elsePart: AbstractNode, position: NodePosition) {
        super(position)
        this.thenPart = thenPart
        this.elsePart = elsePart
        this.condition = condition
        this.position = position
    }
}
