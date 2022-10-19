import { AbstractNode } from "./nodes/AbstractNode"

export interface ParserHandoverResult<T extends AbstractNode> {
    nodeOrNodes: T | Array<T>
    cursor: number
}

export interface ParserInterface {
    handover<T extends AbstractNode>(parser: ParserInterface): T | Array<T>
    receiveHandover<T extends AbstractNode>(text: string): ParserHandoverResult<T>
}