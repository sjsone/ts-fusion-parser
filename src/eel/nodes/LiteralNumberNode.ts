import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class LiteralNumberNode extends AbstractNode {
    public value: string

    public constructor(value: string, position: NodePosition) {
        super(position)
        this.value = value
        this.position = position
    }
}
