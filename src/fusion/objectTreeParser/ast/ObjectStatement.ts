import { Block } from "./Block";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractStatement } from "./AbstractStatement";
import { ObjectPath } from "./ObjectPath";
import { ValueCopy } from "./ValueCopy";
import { ValueAssignment } from "./ValueAssignment";
import { ValueUnset } from "./ValueUnset";
import { NodePosition } from "./NodePosition";

export class ObjectStatement extends AbstractStatement
{
    
    public  path: ObjectPath
    
    public operation: ValueAssignment|ValueCopy|ValueUnset|null
    
    public block: Block|undefined
    
    public cursor: number

    public constructor(path: ObjectPath, operation: ValueAssignment|ValueCopy|ValueUnset|null, block: Block|undefined, cursor: number, position: NodePosition) {
        super()
        this.path = path
        this.operation = operation
        this.block = block
        this.cursor = cursor
        this.position = position
    }

    public visit( visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitObjectStatement(this, args.shift())
    }
}