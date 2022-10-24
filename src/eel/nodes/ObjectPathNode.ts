import { AbstractNode } from "./AbstractNode";
import { AbstractValueNode } from "./AbstractValueNode";
import { NodePosition } from "./NodePosition";

export class ObjectPathNode extends AbstractValueNode<string> {
    public offset: AbstractNode | undefined

    public constructor(value: string, position: NodePosition, parent: AbstractNode | undefined = undefined, offset: AbstractNode | undefined = undefined) {
        super(value, position, parent)
        this.offset = offset
        if(this.offset) this.offset["parent"] = this
    }
}

