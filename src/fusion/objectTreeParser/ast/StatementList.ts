

import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { AbstractStatement } from './AbstractStatement'
import { NodePositionStub } from "../../../common/NodePosition";

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

}
