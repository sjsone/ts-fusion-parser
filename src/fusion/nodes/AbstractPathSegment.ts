import { AbstractNode } from "../../common/AbstractNode";
import { NodePositionInterface } from "../../common/NodePositionInterface";
import { VisitableAbstractNode } from "./VisitableAbstractNode";


export abstract class AbstractPathSegment extends VisitableAbstractNode {

    constructor(public identifier: string, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
    }
}
