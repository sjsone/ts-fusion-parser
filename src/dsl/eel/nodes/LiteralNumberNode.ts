import { AbstractLiteralNode } from "./AbstractLiteralNode";

export class LiteralNumberNode extends AbstractLiteralNode<string> {
    public toString(intend?: number): string {
        return this.value
    }
}
