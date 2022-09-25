import { AbstractEELNode } from "./AbstractEELNode";


export class StatementEELNode extends AbstractEELNode {
    public path: string

    constructor(path: string) {
        super()
        this.path = path
    }
}