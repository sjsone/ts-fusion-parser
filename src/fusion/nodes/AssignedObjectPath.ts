import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface"
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { ObjectPath } from "./ObjectPath"
import { NodePositionStub } from "../../common/NodePosition";


export class AssignedObjectPath extends VisitableAbstractNode {
    public objectPath: ObjectPath

    public isRelative: boolean

    public constructor(objectPath: ObjectPath, isRelative: boolean) {
        super(NodePositionStub)
        this.objectPath = objectPath
        this.objectPath["parent"] = this
        this.isRelative = isRelative
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitAssignedObjectPath(this);
    }
}