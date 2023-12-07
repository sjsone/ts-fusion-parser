import { Parser } from "../out/dsl/eel/parser.js"
import { Lexer } from "../out/dsl/eel/lexer.js"


export const parseEel = (eel, options = undefined) => (new Parser(new Lexer(eel))).parse()

export const P = (begin, end) => ({ begin, end })

export const buildNode = (abstractNodeConstructor, position, ...constructorArgs) => {
    return new abstractNodeConstructor()
}
