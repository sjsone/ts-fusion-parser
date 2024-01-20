import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class TextNode extends AbstractNode {
    public text: string

    constructor(position: NodePositionInterface, text: string, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.text = text
    }

    public toString(intend: number = 0): string {
        const strIntend = "    ".repeat(intend)

        return this.text.trim().replace(/\n/g, "\n" + strIntend)
    }
}