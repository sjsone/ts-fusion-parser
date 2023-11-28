import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractNode } from "../../../common/AbstractNode";

export class TextNode extends AbstractNode {
    protected text: string

    constructor(position: NodePositionInterface, text: string, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.text = text
    }
    public toString(intend: number = 0): string {
        const strIntend = "    ".repeat(intend)

        return this.text.trim().replace(/\n/g, "\n"+strIntend)
    }
}