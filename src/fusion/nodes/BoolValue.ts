import { NodePositionStub } from "../../common/NodePosition";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class BoolValue extends AbstractPathValue {
    public value: boolean
    public constructor(value: boolean) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitBoolValue(this);
    }
}
