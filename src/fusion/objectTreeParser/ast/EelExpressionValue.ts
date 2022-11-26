import { AbstractNode } from "../../../common/AbstractNode";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "../../../common/NodePosition";

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
