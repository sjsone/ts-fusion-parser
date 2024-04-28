import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList";
import { NodePositionInterface } from "../../common/NodePositionInterface";
import { AbstractNode } from "../../common/AbstractNode";

export class Block extends VisitableAbstractNode {
    public constructor(parent: AbstractNode, public statementList: StatementList, position: NodePositionInterface) {
        super(position, parent)
        this.statementList = statementList
        AbstractNode.setParentOfNode(this.statementList, this)
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitBlock(this, args.shift());
    }
}
