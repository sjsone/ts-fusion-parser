import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class LiteralNumberNode extends AbstractNode {
    public value: string

    public constructor(value: string, position: NodePositionInterface, parent: AbstractNode | null = null) {
        super(position, parent)
        this.value = value
        this.position = position
    }
}
