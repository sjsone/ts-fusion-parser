import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class LiteralArrayNode extends AbstractNode {
    public entries: AbstractNode[]

    public constructor(entries: AbstractNode[], position: NodePosition) {
        super(position)
        this.entries = entries
        this.position = position
    }
}
