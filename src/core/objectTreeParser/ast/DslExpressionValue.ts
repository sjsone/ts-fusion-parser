




import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class DslExpressionValue extends AbstractPathValue
{
    public identifier: string
    public code: string

    public constructor(identifier: string, code: string) {
        super()
        this.identifier = identifier
        this.code = code
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}