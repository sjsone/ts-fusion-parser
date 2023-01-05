import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractNode } from "../../../common/AbstractNode";
import { TagBeginToken, TagEndToken } from "../tokens";

export class TagNameNode extends AbstractNode {
    protected name: string

    constructor(position: NodePositionInterface, name: string, parent: AbstractNode | null = null) {
        super(position, parent)
        this.name = name
    }

    toString(): string {
        return this.name.substring(1)
    }

    static From(token: TagBeginToken|TagEndToken, parent: AbstractNode | null = null) {
        return new this(token.position, token.value, parent)
    }
}