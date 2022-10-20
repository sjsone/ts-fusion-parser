import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { NodePosition } from "./NodePosition";

export class IncludeStatement extends AbstractStatement
{
    public filePattern: string
    public constructor(filePattern: string, position: NodePosition) {
        super()
        this.filePattern = filePattern
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitIncludeStatement(this)
    }
}
