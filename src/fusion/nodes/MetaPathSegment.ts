import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";

export class MetaPathSegment extends AbstractPathSegment {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitMetaPathSegment(this);
    }
}