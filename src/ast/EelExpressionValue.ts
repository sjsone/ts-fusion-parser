import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class EelExpressionValue extends AbstractPathValue
{
    public value: string
    public constructor(value: string) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitEelExpressionValue(this, ...args);
    }
}
