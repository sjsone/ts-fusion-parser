import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList";
import { NodePositionStub } from "../../../common/NodePosition";

export class Block extends VisitableAbstractNode {
    public statementList: StatementList

    public constructor(statementList: StatementList) {
        super(NodePositionStub)
        this.statementList = statementList
        this.statementList["parent"] = this
    }

}
