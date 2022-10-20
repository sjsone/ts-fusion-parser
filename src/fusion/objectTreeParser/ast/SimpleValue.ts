


import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class SimpleValue extends AbstractPathValue
{
    public value: any
    public constructor(value: any) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitSimpleValue(this);
    }
}