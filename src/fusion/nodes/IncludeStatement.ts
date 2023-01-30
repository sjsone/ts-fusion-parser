import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class IncludeStatement extends AbstractStatement
{
    public filePattern: string
    public constructor(filePattern: string, position: NodePosition) {
        super(NodePositionStub)
        this.filePattern = filePattern
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitIncludeStatement(this)
    }
}
