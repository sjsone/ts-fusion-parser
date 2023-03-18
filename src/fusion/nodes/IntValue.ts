






import { NodePositionStub } from "../../common/NodePosition";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class IntValue extends AbstractPathValue {
    public value: number
    public constructor(value: number) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: FusionNodeVisitorInterface<any>) {
        return visitor.visitIntValue(this);
    }
}