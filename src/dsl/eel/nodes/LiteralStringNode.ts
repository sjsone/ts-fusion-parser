import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralStringNode extends AbstractLiteralNode<string> {
    protected quotationType: string

    constructor(value: string, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        const quotationType = value[0]
        value = value.substring(1, value.length - 1);
        super(value, position, parent)
        this.quotationType = quotationType
    }

    public toString(intend?: number | undefined): string {
        return this.quotationType + this.value + this.quotationType
    }
}