import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class LiteralBooleanNode extends AbstractNode {
    public value: string

    public constructor(value: string, position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.value = value
        this.position = position
    }
}
