


import { NodePositionStub } from "../../common/NodePosition";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class SimpleValue extends AbstractPathValue {
    public value: any
    public constructor(value: any) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitSimpleValue(this);
    }
}