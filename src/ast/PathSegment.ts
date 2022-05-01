import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";










export class PathSegment extends AbstractPathSegment
{
    public identifier: string
    public  constructor(identifier: string) {
        super()
        this.identifier = identifier
    }

    public  visit( visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitPathSegment(this, ...args);
    }
}
