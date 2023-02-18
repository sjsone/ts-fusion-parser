import { VisitableAbstractNode } from "./VisitableAbstractNode";


export abstract class AbstractPathSegment extends VisitableAbstractNode {
    protected abstract identifier: string
}
