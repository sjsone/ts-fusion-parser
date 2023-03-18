

import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { AbstractStatement } from './AbstractStatement'
import { NodePositionStub } from "../../common/NodePosition";
import { Comment } from "../../common/Comment";

type FusionNodeVisitorInterface = any

export class StatementList extends VisitableAbstractNode {
    public statements: AbstractStatement[] = [];
    public comments: Comment[]

    public constructor(statements: AbstractStatement[], comments: Comment[] = []) {
        super(NodePositionStub)

        this.statements = statements;
        for (const statement of this.statements) {
            statement["parent"] = this
        }

        this.comments = comments;
        for (const comment of this.comments) {
            comment["parent"] = this
        }
    }

    public toString(intend: number = 0): string {
        return this.statements.map(statement => statement.toString(intend + 1)).join("\n")
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitStatementList(this)
    }
}
