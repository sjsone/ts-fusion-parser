import { AbstractEELNode } from "./AbstractEELNode";

export class StringLiteralEELNode extends AbstractEELNode {
    public text: string

    constructor(text: string) {
        super()
        this.text = text
    }
}