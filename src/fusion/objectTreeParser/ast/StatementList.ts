

import { AbstractNode } from './AbstractNode';
import { AbstractStatement } from './AbstractStatement'

type AstNodeVisitorInterface = any

export class StatementList extends AbstractNode {
    public statements: AbstractStatement[] = [];

    public constructor(...statements: AbstractStatement[]) {
        super()
        
        this.statements = statements;
        for (const statement of this.statements) {
            statement["parent"] = this
        }
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitStatementList(this)
    }
}
