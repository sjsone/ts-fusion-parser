import { NodePosition } from "./NodePosition"
import { AbstractNode } from "./AbstractNode"

export class CallbackNode extends AbstractNode {
    protected signature: string
    protected body: AbstractNode
    constructor(signature: string, body: AbstractNode, position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.signature = signature
        this.body = body
    }
}