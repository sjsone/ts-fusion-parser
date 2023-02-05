import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class Comment extends AbstractNode {
    public value: string
    public multiline: boolean
    public prefix: string

    public constructor(value: string, multiline: boolean, prefix: string, nodePosition: NodePosition) {
        super(nodePosition)

        this.value = value
        this.multiline = multiline
        this.prefix = prefix
    }

}
