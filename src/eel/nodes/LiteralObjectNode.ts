import { AbstractNode } from "./AbstractNode";
import { LiteralObjectEntryNode } from "./LiteralObjectEntryNode";
import { NodePosition } from "./NodePosition";

export class LiteralObjectNode extends AbstractNode {
    public entries: LiteralObjectEntryNode[]

    public constructor(entries: LiteralObjectEntryNode[], position: NodePosition) {
        super(position)
        this.entries = entries
    }
}
