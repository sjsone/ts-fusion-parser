
import { NodePositionStub } from "../../common/NodePosition";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class CharValue extends AbstractPathValue {
    public value: string
    public constructor(value: string) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitCharValue(this);
    }
}

