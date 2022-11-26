export abstract class Token {
    public abstract regex: RegExp
    public value: string = ""
    public position = {
        begin: -1,
        end: -1
    }
}

export type TokenConstructor = new (...args: any) => Token
