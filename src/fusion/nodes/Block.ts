import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList";
import { NodePositionStub } from "../../common/NodePosition";
import { NodePositionInterface } from "../../common/NodePositionInterface";

export class Block extends VisitableAbstractNode {
    public constructor(public statementList: StatementList, position: NodePositionInterface) {
        super(position)
        this.statementList = statementList
        this.statementList["parent"] = this
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitBlock(this, args.shift());
    }
}
