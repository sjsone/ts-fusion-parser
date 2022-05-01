import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class NullValue extends AbstractPathValue
{
    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitNullValue(this, ...args);
    }
}
