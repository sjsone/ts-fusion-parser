import { AbstractNode } from "../../../common/AbstractNode"
import { NodePositionInterface } from "../../../common/NodePositionInterface"
import { EelNode } from "./EelNode"

export class CallbackNode extends EelNode {
    protected signature: string
    protected body: AbstractNode

    constructor(signature: string, body: AbstractNode, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.signature = signature
        this.body = body
        AbstractNode.setParentOfNode(body, this)
    }

    public toString(intend?: number): string {
        return `${this.signature} ${this.body.toString()}`
    }
}