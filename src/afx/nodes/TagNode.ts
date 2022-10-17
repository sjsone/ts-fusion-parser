import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { TagAttributeNode } from "./TagAttributeNode";
import { TagNameNode } from "./TagNameNode";
import { TextNode } from "./TextNode";

export class TagNode extends AbstractNode {
    protected name: string
    protected begin: TagNameNode

    protected end: TagNameNode | undefined

    protected attributes: TagAttributeNode[]
    protected content: Array<TagNode|TextNode>
    protected selfClosing: boolean

    constructor(position: NodePosition, name: string, begin: TagNameNode, attributes: TagAttributeNode[], content: Array<TagNode|TextNode>,  end: TagNameNode | undefined = undefined, selfClosing: boolean = false) {
        super(position)
        this.name = name
        this.begin = begin

        this.end = end

        this.attributes = attributes
        this.content = content

        this.selfClosing = selfClosing
    }
}