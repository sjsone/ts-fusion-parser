import { AbstractNode } from "./AbstractNode";
import { LiteralObjectEntryNode } from "./LiteralObjectEntryNode";
import { NodePosition } from "./NodePosition";

export class LiteralObjectNode extends AbstractNode {
    public entries: LiteralObjectEntryNode[]

    public constructor(entries: LiteralObjectEntryNode[], position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.entries = entries
        for(const entry of this.entries) {
            entry["parent"] = this
        } 
    }
}
