import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectOffsetAccessPathNode extends ObjectPathNode {
    public expression: AbstractNode

    public constructor(expression: AbstractNode, position: NodePosition, offset: AbstractNode | undefined = undefined) {
        super('', position, undefined, offset)
        this.expression = expression
    }
}