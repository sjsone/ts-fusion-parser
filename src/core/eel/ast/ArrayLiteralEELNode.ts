import { AbstractEELNode } from "./AbstractEELNode";
import { StringLiteralEELNode } from "./StringLiteralEELNode";

export class ArrayLiteralEELNode extends AbstractEELNode {
    public entries: AbstractEELNode[]

    constructor(entries: AbstractEELNode[]) {
        super()
        this.entries = entries
    }
}
