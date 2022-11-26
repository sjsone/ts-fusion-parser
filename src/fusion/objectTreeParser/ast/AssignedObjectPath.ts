import { AstNodeVisitorInterface } from "../astNodeVisitorInterface"
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { ObjectPath } from "./ObjectPath"


export class AssignedObjectPath extends VisitableAbstractNode {
    public objectPath: ObjectPath

    public isRelative: boolean

    public constructor(objectPath: ObjectPath, isRelative: boolean) {
        super()
        this.objectPath = objectPath
        this.objectPath["parent"] = this
        this.isRelative = isRelative
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitAssignedObjectPath(this);
    }
}
