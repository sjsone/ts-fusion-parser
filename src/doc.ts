import { DocLexer } from "./dsl/doc/lexer"
import { DocParser } from "./dsl/doc/parser"

const multiLineSource = `/**
This is the short descriptions.
May even be multiple lines

# usage 

Lorem Ipsum

some other

\`\`\`
prototype(some.Test:name) {

    test = afx\`
        <div>asdf</div>
    \`
}
\`\`\`

> Test asdf

**/`

//  /// <string| string[] |   null | {key: "value", foo: string[]}> asdföalksdjfö asödlkfjöalsd
const singleLineSource = `/// < string | test[]| (string|thing)[] | \\Vendor\\Site\\Obj | test<string|tets[]> > Lorem Ipsum`

const docParser = new DocParser(new DocLexer(singleLineSource))

const singleLineResult = docParser.parseSingleLine()

console.log("singleLineResult", singleLineResult)