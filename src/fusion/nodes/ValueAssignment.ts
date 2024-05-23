import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "../../common/NodePosition";
import { AbstractNode } from "../../common/AbstractNode";

export class ValueAssignment extends AbstractOperation {
    public pathValue: AbstractPathValue

    public constructor(pathValue: AbstractPathValue, position: NodePosition, parent: AbstractNode) {
        super(position, parent)
        this.pathValue = pathValue
        AbstractNode.setParentOfNode(this.pathValue, this)
    }


    public visit(visitor: AstNodeVisitorInterface, currentPath: string[]): unknown {
        return visitor.visitValueAssignment(this, currentPath);
    }
}
