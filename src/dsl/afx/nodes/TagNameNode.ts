import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { TagBeginToken, TagEndToken } from "../tokens";

export class TagNameNode extends AbstractNode {
    protected name: string

    constructor(position: NodePosition, name: string, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.name = name
    }

    toString() {
        return this.name.substring(1)
    }

    static From(token: TagBeginToken|TagEndToken, parent: AbstractNode | undefined = undefined) {
        return new this(token.position, token.value, parent)
    }
}