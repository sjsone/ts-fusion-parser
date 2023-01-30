import type { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";


export class ValueUnset extends AbstractOperation

{
    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitValueUnset(this);
    }
}
