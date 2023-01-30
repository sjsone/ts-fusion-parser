import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";


export class ObjectPath extends VisitableAbstractNode {
    public segments: AbstractPathSegment[];

    public constructor(...segments: AbstractPathSegment[]) {
        super(NodePositionStub)

        this.segments = segments;
        for (const segment of this.segments) {
            segment["parent"] = this
        }
    }

    public visit(visitor: AstNodeVisitorInterface, currentPathPrefix: string[]) {
        return visitor.visitObjectPath(this, currentPathPrefix)
    }

    public setPosition(position: NodePosition) {
        this.position = position
    }

    protected debugPrintInner(): void {
        for (const segment of this.segments) {
            segment.debugPrint()
        }
    }
}
