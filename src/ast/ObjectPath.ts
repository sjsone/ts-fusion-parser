import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractNode } from "./AbstractNode";
import { AbstractPathSegment } from "./AbstractPathSegment";


export class ObjectPath extends AbstractNode
{
    public segments: AbstractPathSegment[];

    public constructor(...segments: AbstractPathSegment[])
    {
        super()
        this.segments = segments;
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitObjectPath(this, ...args)
    }

    protected debugPrintInner(): void {
        for(const segment of this.segments) {
            segment.debugPrint()
        }
    }
}
