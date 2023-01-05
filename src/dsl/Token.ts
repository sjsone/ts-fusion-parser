import { NodePositionInterface } from "../common/NodePositionInterface"

export abstract class Token {
    public regex: RegExp = new RegExp("")
    public value: string = ""
    public position: NodePositionInterface = {
        begin: -1,
        end: -1
    }
}

export type TokenConstructor = new (...args: any) => Token
