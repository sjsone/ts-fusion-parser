import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { TagAttributeNode } from "./TagAttributeNode";
import { TagNameNode } from "./TagNameNode";

export class TagNode extends AbstractNode {
    protected name: string
    protected begin: TagNameNode

    protected end: TagNameNode | undefined

    protected attributes: TagAttributeNode[]
    protected selfClosing: boolean

    constructor(position: NodePosition, name: string, begin: TagNameNode, attributes: TagAttributeNode[], end: TagNameNode | undefined = undefined, selfClosing: boolean = false) {
        super(position)
        this.name = name
        this.begin = begin

        this.end = end

        this.attributes = attributes

        this.selfClosing = selfClosing
    }
}