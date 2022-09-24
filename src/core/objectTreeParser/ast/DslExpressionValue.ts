




import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "./NodePosition";

export class DslExpressionValue extends AbstractPathValue
{
    public identifier: string
    public code: string

    public constructor(identifier: string, code: string, position: NodePosition) {
        super()
        this.identifier = identifier
        this.code = code
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}