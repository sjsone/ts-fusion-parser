import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractNode } from "./AbstractNode";
import { StatementList } from "./StatementList";

export class Block extends AbstractNode
{
    public statementList: StatementList
    public constructor(statementList: StatementList) {
        super()
        this.statementList = statementList
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitBlock(this, ...args);
    }
}
