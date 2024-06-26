import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class TagAttributeNode extends AbstractNode {
    public name: string
    public value: any

    constructor(position: NodePositionInterface, name: string, value: any) {
        super(position)
        this.name = name
        this.value = value
        if (Array.isArray(this.value)) {
            for (const element of this.value) {
                if (element instanceof AbstractNode) AbstractNode.setParentOfNode(element, this)
            }
        }
    }

    public toString(intend?: number): string {
        const valueString = Array.isArray(this.value) ? "{" + this.value.map(v => v.toString()).join(" ") + "}" : this.value
        return this.name + "=" + valueString
    }
}