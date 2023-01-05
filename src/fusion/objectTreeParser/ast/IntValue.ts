






import { NodePositionStub } from "../../../common/NodePosition";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class IntValue extends AbstractPathValue {
    public value: number
    public constructor(value: number) {
        super(NodePositionStub)
        this.value = value
    }

}