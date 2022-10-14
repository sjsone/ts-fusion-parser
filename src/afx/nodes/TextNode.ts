import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";

export class TextNode extends AbstractNode {
    protected text: string

    constructor(position: NodePosition, text: string) {
        super(position)
        this.text = text
    }
}