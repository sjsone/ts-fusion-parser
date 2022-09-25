import { AbstractEELNode } from "./AbstractEELNode";
import { ObjectLiteralEELNode } from "./ObjectLiteralEELNode";
import { StatementEELNode } from "./StatementEELNode copy";
import { StringLiteralEELNode } from "./StringLiteralEELNode";


export class FunctionStatementEELNode extends AbstractEELNode {
    public path: string
    public arguments: Array<any>
    public tail?: StatementEELNode|FunctionStatementEELNode|StringLiteralEELNode|ObjectLiteralEELNode

    constructor(path: string, args: any[]) {
        super()
        this.path = path
        this.arguments = args
    }

    
}