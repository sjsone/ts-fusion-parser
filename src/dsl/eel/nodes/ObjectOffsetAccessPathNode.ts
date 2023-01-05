import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectOffsetAccessPathNode extends ObjectPathNode {
    public expression: AbstractNode

    public constructor(expression: AbstractNode, position: NodePositionInterface, offset: AbstractNode | null = null) {
        super('', position, null, offset)
        this.expression = expression
        this.expression["parent"] = this
    }
}