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

const afx = `
    <div data-list={props.list} >
        test {props.text}
    </div>
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

const hrStart = process.hrtime()
const nodes = parser.parse()
const hrEnd = process.hrtime(hrStart)

let nodeCount = 0
for (const entry of parser.nodesByType.entries()) {
    nodeCount += entry[1].length
}

console.info('Execution time: %ds %dms', hrEnd[0], hrEnd[1] / 1000000)
const executionTimeInMS = (hrEnd[0] * 1000) + (hrEnd[1] / 1000000)

console.log("node count", nodeCount)
console.log("character count", text.length)
console.log("nodes per MS", nodeCount / executionTimeInMS)
console.log("Character per MS", text.length / executionTimeInMS)