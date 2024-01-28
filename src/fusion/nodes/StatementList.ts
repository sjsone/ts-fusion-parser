

import { Comment } from "../../common/Comment";
import { NodePositionStub } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from './AbstractStatement';
import { VisitableAbstractNode } from "./VisitableAbstractNode";

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

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitStatementList(this)
    }
}
