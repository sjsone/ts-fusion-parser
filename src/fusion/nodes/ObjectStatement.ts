import { Block } from "./Block";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { ObjectPath } from "./ObjectPath";
import { ValueCopy } from "./ValueCopy";
import { ValueAssignment } from "./ValueAssignment";
import { ValueUnset } from "./ValueUnset";
import { NodePosition } from "../../common/NodePosition";
import { AbstractNode } from "../../common/AbstractNode";

// TODO: Generic for operation type
export class ObjectStatement extends AbstractStatement {
    public path: ObjectPath
    public operation: ValueAssignment | ValueCopy | ValueUnset | null
    public block: Block | undefined
    public cursor: number

    public constructor(path: ObjectPath, operation: ValueAssignment | ValueCopy | ValueUnset | null, block: Block | undefined, cursor: number, position: NodePosition, parent: AbstractNode) {
        super(position, parent)

        this.path = path
        AbstractNode.setParentOfNode(this.path, this)

        this.operation = operation
        if (this.operation) AbstractNode.setParentOfNode(this.operation, this)

        this.block = block
        if (this.block) AbstractNode.setParentOfNode(this.block, this)

        this.cursor = cursor
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]): unknown {
        return visitor.visitObjectStatement(this, args.shift())
    }
}
