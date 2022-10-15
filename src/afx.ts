import { Lexer } from "./afx/lexer"
import { Parser } from "./afx/parser"

import * as NodeFs from "fs"

const simpleText = `
    asfd &lt;
`

const singleSelfClosing = `
    <image />
`

const singleClosing = `
    <div>asf</div>
`
const singleClosingWithAttributes = `
    <div enabled true=true test="attribute value" >asf</div>
    More Text 
`

const html = `
<html>
<body>

<h1 style="font-size:300%;" >This is a heading</h1>
<p style="font-size:160%;" >This is a paragraph.</p>

</body>
</html>
`

const htmlFile = NodeFs.readFileSync("src/test.html").toString()

const text = htmlFile
const lexer = new Lexer(text)
const parser = new Parser(lexer)

for(const node of parser.parse()) {
    console.log(node)
}
