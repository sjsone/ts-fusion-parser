import { AbstractNode } from "../../../common/AbstractNode";
import { AbstractValueNode } from "./AbstractValueNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class ObjectPathNode extends AbstractValueNode<string> {
    public offset: AbstractNode | undefined

    public constructor(value: string, position: NodePositionInterface, parent: AbstractNode | undefined = undefined, offset: AbstractNode | undefined = undefined) {
        super(value, position, parent)
        this.offset = offset
        if(this.offset) this.offset["parent"] = this
    }
}

