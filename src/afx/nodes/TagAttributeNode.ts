import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class TagAttributeNode extends AbstractNode {
    public name: string
    public value: any
    
    constructor(position: NodePosition, name: string, value: any) {
        super(position)
        this.name = name
        this.value = value
        if(this.value instanceof AbstractNode) this.value["parent"] = this
    }
}