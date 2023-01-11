import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class LiteralNullNode extends AbstractNode {
    public value: string

    public constructor(value: string, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.value = value
        this.position = position
    }

    public toString(intend?: number): string {
        return this.value
    }
}
