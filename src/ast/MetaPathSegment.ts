





import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";

export class MetaPathSegment extends AbstractPathSegment
{
    public  identifier: string
    public constructor(identifier: string) {
        super()
        this.identifier = identifier
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitMetaPathSegment(this, ...args);
    }
}