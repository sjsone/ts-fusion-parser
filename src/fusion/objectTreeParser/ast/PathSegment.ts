import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition } from "../../../common/NodePosition";


export class PathSegment extends AbstractPathSegment
{
    public identifier: string

    public  constructor(identifier: string, position: NodePosition) {
        super()
        this.identifier = identifier
        this.position = position
    }

    public  visit( visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitPathSegment(this);
    }
}
