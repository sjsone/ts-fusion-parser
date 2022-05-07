import type { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";


export class ValueUnset extends AbstractOperation
{
    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitValueUnset(this, ...args);
    }
}
