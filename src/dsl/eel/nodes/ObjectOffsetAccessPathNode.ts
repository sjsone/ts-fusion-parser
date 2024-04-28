import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectOffsetAccessPathNode extends ObjectPathNode {
    public expression: AbstractNode

    public constructor(expression: AbstractNode, position: NodePositionInterface, offset: AbstractNode | undefined = undefined) {
        super('', position, undefined, offset)
        this.expression = expression
        AbstractNode.setParentOfNode(this.expression, this)
    }

    public toString(intend?: number | undefined): string {
        return `[${this.expression.toString()}]` + (this.offset?.toString() ?? '')
    }
}