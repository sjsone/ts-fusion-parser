import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";

export class IncludeStatement extends AbstractStatement
{
    public filePattern: string
    public constructor(filePattern: string) {
        super()
        this.filePattern = filePattern
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitIncludeStatement(this)
    }
}
