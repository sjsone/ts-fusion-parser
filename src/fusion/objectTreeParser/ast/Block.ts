import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList";

export class Block extends VisitableAbstractNode {
    public statementList: StatementList

    public constructor(statementList: StatementList) {
        super()
        this.statementList = statementList
        this.statementList["parent"] = this
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitBlock(this, args.shift());
    }
}
