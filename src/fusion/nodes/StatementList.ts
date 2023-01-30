

import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { AbstractStatement } from './AbstractStatement'
import { NodePositionStub } from "../../common/NodePosition";

type AstNodeVisitorInterface = any

export class StatementList extends VisitableAbstractNode {
    public statements: AbstractStatement[] = [];

    public constructor(...statements: AbstractStatement[]) {
        super(NodePositionStub)

        this.statements = statements;
        for (const statement of this.statements) {
            statement["parent"] = this
        }
    }

    public toString(intend: number = 0): string {
        return this.statements.map(statement => statement.toString(intend+1)).join("\n")
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitStatementList(this)
    }
}
