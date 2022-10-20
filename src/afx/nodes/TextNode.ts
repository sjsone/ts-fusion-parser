import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";

export class TextNode extends AbstractNode {
    protected text: string
    protected inlineEel: AbstractNode[]

    constructor(position: NodePosition, text: string, inlineEel: AbstractNode[] = [], parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.text = text
        this.inlineEel = inlineEel
    }
}