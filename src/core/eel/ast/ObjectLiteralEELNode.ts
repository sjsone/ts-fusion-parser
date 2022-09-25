import { AbstractEELNode } from "./AbstractEELNode";
import { StringLiteralEELNode } from "./StringLiteralEELNode";

export class ObjectLiteralEELNode extends AbstractEELNode {
    public entries: ObjectLiteralEELNodeEntry[]

    constructor(entries: ObjectLiteralEELNodeEntry[]) {
        super()
        this.entries = entries
    }
}

export interface ObjectLiteralEELNodeEntry {
    key: StringLiteralEELNode,
    value: AbstractEELNode
}