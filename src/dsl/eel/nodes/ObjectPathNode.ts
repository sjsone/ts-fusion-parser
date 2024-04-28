import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractValueNode } from "./AbstractValueNode";
import { LiteralObjectNode } from "./LiteralObjectNode";
import { ObjectNode } from "./ObjectNode";

export class ObjectPathNode extends AbstractValueNode<string> {
    public offset: AbstractNode | undefined
    public incomplete: boolean = false

    public constructor(value: string, position: NodePositionInterface, parent?: ObjectNode | LiteralObjectNode, offset: AbstractNode | undefined = undefined) {
        super(value, position, parent)
        this.offset = offset
        if (this.offset) AbstractNode.setParentOfNode(this.offset, this)
    }

    public toString(intend?: number | undefined): string {
        return this.value + (this.offset?.toString() ?? '')
    }
}

