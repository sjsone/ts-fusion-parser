import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class BlockExpressionNode extends AbstractNode {
    public node: AbstractNode
    public constructor(node: AbstractNode, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.node = node
        this.node["parent"] = this
        this.position = position

    }
}

