import { Lexer } from "./dsl/afx/lexer"
import { Parser } from "./dsl/afx/parser"

import * as NodeFs from "fs"
import { ObjectPathNode } from "./dsl/eel/nodes/ObjectPathNode"
import { InlineEelNode } from "./dsl/afx/nodes/InlineEelNode"
import { ObjectNode } from "./dsl/eel/nodes/ObjectNode"
import { TagNode } from "./dsl/afx/nodes/TagNode"

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

const afx = `
    <div>
        <div data-list={props.list} >
            test {props.text}    {asdf.lkjh.asdf}
        </div>
    </div>
`

const notWorking = `

<div>
{props.text}
</div>
<div>
`
const parser = new Parser(new Lexer(notWorking))
let nodes: any = parser.parse(true)



nodes = parser.nodesByType.get(<any>TagNode) 
console.log("nodes", nodes.map((node: TagNode) => notWorking.substring(node["position"].begin, node["position"].end)))