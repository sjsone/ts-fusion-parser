import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class SpreadOperationNode extends AbstractNode {
    public node: AbstractNode

    public constructor(node: AbstractNode, position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.node = node
        this.node["parent"] = this
        this.position = position
    }
}
