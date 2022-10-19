import { AbstractNode } from "./AbstractNode"
import { NodePosition } from "./NodePosition"
import { ObjectPathNode } from "./ObjectPathNode"

export class ObjectFunctionPathNode extends ObjectPathNode {
    public args: any[]

    public constructor(value: string, args: any[], position: NodePosition, offset: AbstractNode | undefined = undefined) {
        super(value, position)
        this.args = args
        this.offset = offset
    }
}