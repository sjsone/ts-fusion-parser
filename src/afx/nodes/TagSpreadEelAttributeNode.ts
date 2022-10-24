import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class TagSpreadEelAttributeNode extends AbstractNode {
    public nodes: AbstractNode[]

    constructor(position: NodePosition, nodes: AbstractNode[]) {
        super(position)
        this.nodes = nodes
        for (const node of this.nodes) {
            node["parent"] = this
        }
    }
}