import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralNullNode extends AbstractLiteralNode<string> {
    public toString(intend?: number): string {
        return this.value
    }
}
