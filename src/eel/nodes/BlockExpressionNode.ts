import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class BlockExpressionNode extends AbstractNode {
    public node: AbstractNode
    public constructor(node: AbstractNode, position: NodePosition) {
        super(position)
        this.node = node
        this.node["parent"] = this
        this.position = position

    }
}

