import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition } from "../../common/NodePosition";
import { AbstractNode } from "../../common/AbstractNode";


export class ObjectPath extends VisitableAbstractNode {
    public segments: AbstractPathSegment[];

    public constructor(position: NodePosition, parent: AbstractNode, ...segments: AbstractPathSegment[]) {
        super(position, parent)

        this.segments = segments;
        for (const segment of this.segments) {
            AbstractNode.setParentOfNode(segment, this)
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
