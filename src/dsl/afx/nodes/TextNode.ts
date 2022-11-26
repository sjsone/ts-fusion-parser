import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { InlineEelNode } from "./InlineEelNode";

export class TextNode extends AbstractNode {
    protected text: string
    protected inlineEel: InlineEelNode[]

    constructor(position: NodePosition, text: string, inlineEel: InlineEelNode[] = [], parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.text = text
        this.inlineEel = inlineEel
        for (const inlineEel of this.inlineEel) {
            inlineEel["parent"] = this
        }
    }
}