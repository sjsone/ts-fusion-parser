import { AbstractNode } from "../../../common/AbstractNode";
import { AbstractValueNode } from "./AbstractValueNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class ObjectPathNode extends AbstractValueNode<string> {
    public offset: AbstractNode | null

    public constructor(value: string, position: NodePositionInterface, parent: AbstractNode | null = null, offset: AbstractNode | null = null) {
        super(value, position, parent)
        this.offset = offset
        if(this.offset) this.offset["parent"] = this
    }
}

