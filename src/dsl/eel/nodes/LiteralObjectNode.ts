import { AbstractNode } from "../../../common/AbstractNode";
import { LiteralObjectEntryNode } from "./LiteralObjectEntryNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class LiteralObjectNode extends AbstractNode {
    public entries: LiteralObjectEntryNode[]

    public constructor(entries: LiteralObjectEntryNode[], position: NodePositionInterface, parent: AbstractNode | null = null) {
        super(position, parent)
        this.entries = entries
        for(const entry of this.entries) {
            entry["parent"] = this
        } 
    }
}
