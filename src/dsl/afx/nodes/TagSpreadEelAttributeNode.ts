import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class TagSpreadEelAttributeNode extends AbstractNode {
    public nodes: AbstractNode[]

    constructor(position: NodePositionInterface, nodes: AbstractNode[]) {
        super(position)
        this.nodes = nodes
        for (const node of this.nodes) {
            node["parent"] = this
        }
    }
}