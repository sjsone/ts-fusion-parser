


import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class SimpleValue extends AbstractPathValue
{
    public value: any
    public constructor(value: any) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitSimpleValue(this, ...args);
    }
}