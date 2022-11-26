import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class LiteralArrayNode extends AbstractNode {
    public entries: AbstractNode[]

    public constructor(entries: AbstractNode[], position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)

        this.entries = entries
        for (const entry of this.entries) {
            entry["parent"] = this
        }

        this.position = position
    }
}
