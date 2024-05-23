import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { TagBeginToken, TagEndToken } from "../tokens";

export class TagNameNode extends AbstractNode {
    public name: string

    constructor(position: NodePositionInterface, name: string, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.name = name
    }

    toString(): string {
        return this.name.substring(1)
    }

    static From(token: TagBeginToken | TagEndToken, parent: AbstractNode | undefined = undefined): TagNameNode {
        return new this(token.position, token.value, parent)
    }
}