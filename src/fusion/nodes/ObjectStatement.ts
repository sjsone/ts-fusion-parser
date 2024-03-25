import { Block } from "./Block";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { ObjectPath } from "./ObjectPath";
import { ValueCopy } from "./ValueCopy";
import { ValueAssignment } from "./ValueAssignment";
import { ValueUnset } from "./ValueUnset";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

// TODO: Generic for operation type
export class ObjectStatement extends AbstractStatement {
    public path: ObjectPath
    public operation: ValueAssignment | ValueCopy | ValueUnset | null
    public block: Block | undefined
    public cursor: number

    public constructor(path: ObjectPath, operation: ValueAssignment | ValueCopy | ValueUnset | null, block: Block | undefined, cursor: number, position: NodePosition) {
        super(NodePositionStub)

        this.path = path
        this.path["parent"] = this

        this.operation = operation
        if (this.operation) this.operation["parent"] = this

        this.block = block
        if (this.block) this.block["parent"] = this

        this.cursor = cursor
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitObjectStatement(this, args.shift())
    }

    public toString(intend: number = 0): string {
        return '    '.repeat(intend) + `<${this.constructor.name}>${this.path?.toString(intend + 1)}`
    }
}
