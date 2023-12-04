import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralBooleanNode extends AbstractLiteralNode<string> {
    public toString(intend?: number): string {
        return this.value
    }
}
