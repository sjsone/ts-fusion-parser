import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { AbstractNode } from "../../../common/AbstractNode";
import { TagAttributeNode } from "./TagAttributeNode";
import { TagNameNode } from "./TagNameNode";
import { TextNode } from "./TextNode";
import { TagSpreadEelAttributeNode } from "./TagSpreadEelAttributeNode";
import { Comment } from "../../../common/Comment";

export class TagNode extends AbstractNode {
    protected name: string
    protected begin: TagNameNode

    protected end: TagNameNode | undefined

    protected attributes: Array<TagSpreadEelAttributeNode | TagAttributeNode>
    protected content: Array<TagNode | TextNode | Comment>
    protected selfClosing: boolean
    protected artificiallyClosed: boolean = false


    constructor(position: NodePositionInterface, name: string, begin: TagNameNode, attributes: Array<TagSpreadEelAttributeNode | TagAttributeNode>, content: Array<TagNode | TextNode | Comment>, end: TagNameNode | undefined = undefined, selfClosing: boolean = false, parent: AbstractNode | undefined = undefined) {
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

    public toString(intend: number = 0): string {
        const attributes = this.attributes.length > 0 ? " " + this.attributes.map(a => a.toString()).join(" ") : ""

        const strIntend = "    ".repeat(intend)
        const strIntendC = "    ".repeat(intend + 1)

        const content = this.content.map(c => c.toString(intend + 1)).join("\n" + strIntendC)
        const tagBody = content.length > 0 ? "\n" + strIntendC + content + "\n" + strIntend : ""

        return `<${this.name}${attributes}${this.artificiallyClosed ? ">" : this.selfClosing ? " />" : `>${tagBody}</${this.name}>`}`
    }
}