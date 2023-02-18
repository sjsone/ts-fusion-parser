import { AbstractNode } from "./AbstractNode";

export interface NodeVisitorInterface<T> {
    visitAbstractNode(abstractNode: AbstractNode): T
}