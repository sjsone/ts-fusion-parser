import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralArrayNode extends AbstractLiteralNode<AbstractNode[]> {

    public constructor(entries: AbstractNode[], position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(entries, position, parent)

        for (const entry of this.value) {
            AbstractNode.setParentOfNode(entry, this)
        }
    }

    public toString(intend?: number): string {
        return `[${this.value.map(entry => entry.toString()).join(", ")}]`
    }
}
