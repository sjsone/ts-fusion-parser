import { AstNodeVisitorInterface } from "../astNodeVisitorInterface"
import { AbstractNode } from "./AbstractNode"
import { ObjectPath } from "./ObjectPath"


export class AssignedObjectPath extends AbstractNode {
    public objectPath: ObjectPath

    public isRelative: boolean

    public constructor(objectPath: ObjectPath, isRelative: boolean) {
        super()
        this.objectPath = objectPath
        this.isRelative = isRelative 
    }

    public visit( visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitAssignedObjectPath(this);
    }
}
