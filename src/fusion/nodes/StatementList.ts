import { AbstractNode } from "../../common/AbstractNode";
import { Comment } from "../../common/Comment";
import { NodePosition } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from './AbstractStatement';
import { VisitableAbstractNode } from "./VisitableAbstractNode";

export class StatementList extends VisitableAbstractNode {
    public readonly statements: AbstractStatement[] = [];
    public readonly comments: Comment[]

    public constructor(statements: AbstractStatement[], comments: Comment[] = [], position: NodePosition, parent: AbstractNode) {
        super(position, parent)

        this.statements = statements;
        for (const statement of this.statements) {
            AbstractNode.setParentOfNode(statement, this)
        }

        this.comments = comments;
        for (const comment of this.comments) {
            AbstractNode.setParentOfNode(comment, this)
        }
    }

    public toString(intend: number = 0): string {
        return this.statements.map(statement => statement.toString(intend + 1)).join("\n")
    }

    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitStatementList(this)
    }
}
