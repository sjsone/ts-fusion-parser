import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";
import { LiteralStringNode } from "./LiteralStringNode";
import { ObjectPathNode } from "./ObjectPathNode";

export class LiteralObjectEntryNode extends EelNode {
    public key: LiteralStringNode | ObjectPathNode
    public value: AbstractNode

    public constructor(key: LiteralStringNode | ObjectPathNode, value: AbstractNode, position: NodePositionInterface) {
        super(position)
        this.key = key
        AbstractNode.setParentOfNode(this.key, this)
        this.value = value
        AbstractNode.setParentOfNode(this.value, this)
        this.position = position
    }

    public toString(intend?: number): string {
        return `${this.key.toString()}: ${this.value.toString()}`
    }
}
