import { AbstractNode } from "../../../afx/nodes/AbstractNode";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class EelExpressionValue extends AbstractPathValue
{
    public value = ""
    public nodes: AbstractNode[] = []

    public constructor() {
        super()
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitEelExpressionValue(this);
    }
}
