import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractNode } from "./AbstractNode";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition } from "./NodePosition";


export class ObjectPath extends AbstractNode
{
    public segments: AbstractPathSegment[];

    public constructor(...segments: AbstractPathSegment[])
    {
        super()
        this.segments = segments;
    }

    public visit(visitor: AstNodeVisitorInterface, currentPathPrefix: string[])
    {
        return visitor.visitObjectPath(this, currentPathPrefix)
    }

    public setPosition(position: NodePosition) {
        this.position = position
    }

    protected debugPrintInner(): void {
        for(const segment of this.segments) {
            segment.debugPrint()
        }
    }
}