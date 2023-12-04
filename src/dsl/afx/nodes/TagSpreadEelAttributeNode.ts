import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class TagSpreadEelAttributeNode extends AbstractNode {
    public nodes: AbstractNode[]
    public eel: string

    constructor(position: NodePositionInterface, nodes: AbstractNode[], eel: string) {
        super(position)
        this.nodes = nodes
        for (const node of this.nodes) {
            node["parent"] = this
        }
        this.eel = eel
    }

    public toString(intend?: number): string {
        return "{" + this.nodes.map(v => v.toString()).join(" ") + "}"
    }
}