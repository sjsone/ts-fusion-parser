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
        this.key["parent"] = this
        this.value = value
        this.value["parent"] = this
        this.position = position
    }

    public toString(intend?: number): string {
        return `${this.key.toString()}: ${this.value.toString()}`
    }
}
