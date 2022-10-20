import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class LiteralArrayNode extends AbstractNode {
    public entries: AbstractNode[]

    public constructor(entries: AbstractNode[], position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.entries = entries
        for(const entry of this.entries) {
            entry["parent"] = this
        }
        
        this.position = position
    }
}
