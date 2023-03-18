import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
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

    public visit(visitor: FusionNodeVisitorInterface<any>)
    {
        return visitor.visitIncludeStatement(this)
    }
}
