import { AbstractNode } from "../../../common/AbstractNode"
import { NodePositionInterface } from "../../../common/NodePositionInterface"
import { ObjectPathNode } from "./ObjectPathNode"

export class ObjectFunctionPathNode extends ObjectPathNode {
    public args: AbstractNode[]

    public constructor(value: string, args: AbstractNode[], position: NodePositionInterface, offset: AbstractNode | undefined = undefined) {
        super(value, position)
        this.args = args
        for (const arg of this.args) {
            arg["parent"] = this
        }
        this.offset = offset
    }
}