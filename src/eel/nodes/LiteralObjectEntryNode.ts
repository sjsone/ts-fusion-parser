import { AbstractNode } from "./AbstractNode";
import { LiteralStringNode } from "./LiteralStringNode";
import { NodePosition } from "./NodePosition";

export class LiteralObjectEntryNode extends AbstractNode {
    public key: LiteralStringNode
    public value: AbstractNode

    public constructor(key: LiteralStringNode, value: AbstractNode, position: NodePosition) {
        super(position)
        this.key = key
        this.key["parent"] = this
        this.value = value
        this.value["parent"] = this
        this.position = position
    }
}
