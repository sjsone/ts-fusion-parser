import { AbstractNode } from "../../../common/AbstractNode";
import { LiteralStringNode } from "./LiteralStringNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { ObjectPathNode } from "./ObjectPathNode";

export class LiteralObjectEntryNode extends AbstractNode {
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
}
