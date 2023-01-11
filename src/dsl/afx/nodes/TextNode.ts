import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractNode } from "../../../common/AbstractNode";
import { InlineEelNode } from "./InlineEelNode";

export class TextNode extends AbstractNode {
    protected text: string
    protected inlineEel: InlineEelNode[]

    constructor(position: NodePositionInterface, text: string, inlineEel: InlineEelNode[] = [], parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.text = text
        this.inlineEel = inlineEel
        for (const inlineEel of this.inlineEel) {
            inlineEel["parent"] = this
        }
    }
    public toString(intend: number = 0): string {
        const strIntend = "    ".repeat(intend)

        return this.text.trim().replace(/\n/g, "\n"+strIntend)
    }
}