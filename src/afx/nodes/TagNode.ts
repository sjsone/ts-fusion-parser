import { NodePosition } from "./NodePosition";
import { AbstractNode } from "./AbstractNode";
import { TagAttributeNode } from "./TagAttributeNode";
import { TagNameNode } from "./TagNameNode";
import { TextNode } from "./TextNode";
import { TagSpreadEelAttributeNode } from "./TagSpreadEelAttributeNode";

export class TagNode extends AbstractNode {
    protected name: string
    protected begin: TagNameNode

    protected end: TagNameNode | undefined

    protected attributes: Array<TagSpreadEelAttributeNode | TagAttributeNode>
    protected content: Array<TagNode | TextNode>
    protected selfClosing: boolean

    constructor(position: NodePosition, name: string, begin: TagNameNode, attributes: Array<TagSpreadEelAttributeNode | TagAttributeNode>, content: Array<TagNode | TextNode>, end: TagNameNode | undefined = undefined, selfClosing: boolean = false, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.name = name
        this.begin = begin
        this.begin["parent"] = this

        this.end = end
        if (this.end) this.end["parent"] = this

        this.attributes = attributes
        for (const attribute of this.attributes) { attribute["parent"] = this }

        this.content = content
        for (const content of this.content) { content["parent"] = this }

        this.selfClosing = selfClosing
    }
}