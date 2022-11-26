import { NodePositionInterface } from "../../../common/NodePositionInterface"
import { AbstractNode } from "../../../common/AbstractNode"

export class CallbackNode extends AbstractNode {
    protected signature: string
    protected body: AbstractNode

    constructor(signature: string, body: AbstractNode, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.signature = signature
        this.body = body
        this.body["parent"] = this
    }
}