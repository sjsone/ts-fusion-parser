import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class TagAttributeNode extends AbstractNode {
    public name: string
    public value: any

    constructor(position: NodePosition, name: string, value: any) {
        super(position)
        this.name = name
        this.value = value
        if (Array.isArray(this.value)) {
            for (const element of this.value) {
                if (element instanceof AbstractNode) element["parent"] = this
            }
        }

    }
}