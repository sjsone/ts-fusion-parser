import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";

export class InlineEelNode extends AbstractNode {
    protected eel: AbstractNode[]

    constructor(position: NodePosition, eel: AbstractNode[], parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.eel = eel
    }
}