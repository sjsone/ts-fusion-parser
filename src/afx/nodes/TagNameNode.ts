import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { TagBeginToken, TagEndToken } from "../tokens";

export class TagNameNode extends AbstractNode {
    protected name: string

    constructor(position: NodePosition, name: string) {
        super(position)
        this.name = name
    }

    toString() {
        return this.name.substring(1)
    }

    static From(token: TagBeginToken|TagEndToken) {
        return new this(token.position, token.value)
    }
}