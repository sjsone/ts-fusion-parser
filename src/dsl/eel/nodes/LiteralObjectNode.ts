import { AbstractNode } from "../../../common/AbstractNode";
import { LiteralObjectEntryNode } from "./LiteralObjectEntryNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralObjectNode extends AbstractLiteralNode<LiteralObjectEntryNode[]> {
    public constructor(entries: LiteralObjectEntryNode[], position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(entries, position, parent)
        for (const entry of this.value) {
            entry["parent"] = this
        }
    }

    public toString(intend?: number): string {
        return `{${this.value.map(entry => entry.toString()).join(", ")}}`
    }
}
