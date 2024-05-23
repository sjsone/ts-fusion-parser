import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { NodePosition } from "../../common/NodePosition";
import { AbstractNode } from "../../common/AbstractNode";

export class IncludeStatement extends AbstractStatement {
    public filePattern: string
    public constructor(filePattern: string, position: NodePosition, parent: AbstractNode) {
        super(position, parent)
        this.filePattern = filePattern
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitIncludeStatement(this)
    }
}
