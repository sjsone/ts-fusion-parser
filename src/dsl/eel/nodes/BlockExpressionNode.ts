import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";

export class BlockExpressionNode extends EelNode {
    public node: AbstractNode
    public constructor(node: AbstractNode, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.node = node
        AbstractNode.setParentOfNode(node, this)
        this.position = position

    }

    public toString(intend?: number): string {
        return `(${this.node.toString()})`
    }
}

