

import { AbstractNode } from './AbstractNode';
import {AbstractStatement} from './AbstractStatement'

type AstNodeVisitorInterface = any

export class StatementList extends AbstractNode
{
    public statements: AbstractStatement[] = [];

    public constructor( ...statements: AbstractStatement[])
    {
        super()
        this.statements = statements;
    }

    public visit( visitor: AstNodeVisitorInterface)
    {
        return visitor.visitStatementList(this)
    }
}
