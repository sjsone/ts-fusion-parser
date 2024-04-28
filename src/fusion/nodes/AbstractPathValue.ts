import { NodePosition } from "../../common/NodePosition";
import { VisitableAbstractNode } from "./VisitableAbstractNode";


export abstract class AbstractPathValue<Value = any> extends VisitableAbstractNode {
    public readonly value: Value

    public constructor(value: Value, position: NodePosition) {
        super(position)
        this.value = value
    }
}
