import { Lexer } from "./dsl/afx/lexer"
import { Parser } from "./dsl/afx/parser"

import * as NodeFs from "fs"
import { ObjectPathNode } from "./dsl/eel/nodes/ObjectPathNode"
import { InlineEelNode } from "./dsl/afx/nodes/InlineEelNode"
import { ObjectNode } from "./dsl/eel/nodes/ObjectNode"
import { TagNode } from "./dsl/afx/nodes/TagNode"
import { AbstractNode } from "./common/AbstractNode"
import { AfxFormatter } from "./dsl/afx/AfxFormatter"

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
<p>
<test-a />

</p>asdf
</div>
`

const notWorking = `

<div class="asdf" {...props.testClass}>
before
{props.text}
after
</div>
<div>
`


const stringifyTest = `
<div class="form-group">
                <Neos.Fusion.Form:FieldContainer field.name="firstName" label="First Name" attributes.style="display:flex;flex-direction:column;justify-content:space-between;">
                    <Neos.Fusion.Form:Input attributes.style="width:300px;margin-bottom:15px;" />
                </Neos.Fusion.Form:FieldContainer>
                <Neos.Fusion.Form:FieldContainer field.name="lastName" label="Last Name" attributes.style="display:flex;flex-direction:column;justify-content:space-between;">
                    <Neos.Fusion.Form:Input attributes.style="width:300px;margin-bottom:15px;" />
                </Neos.Fusion.Form:FieldContainer>
                <Neos.Fusion.Form:FieldContainer field.name="username" label="Username" attributes.style="display:flex;flex-direction:column;justify-content:space-between;">
                    <small>(lowercase letters and numbers only)</small>
                    <Neos.Fusion.Form:Input attributes.style="width:300px;margin-bottom:15px;" />
                </Neos.Fusion.Form:FieldContainer>
                <Neos.Fusion.Form:FieldContainer field.name="password" label="Password" attributes.style="display:flex;flex-direction:column;justify-content:space-between;">
                    <Neos.Fusion.Form:Password attributes.style="width:300px" />
                </Neos.Fusion.Form:FieldContainer>
            </div>
`
const parser = new Parser(new Lexer(notWorking))
let nodes: any = parser.parse(true)
const afxFormatter = new AfxFormatter

const formatted = nodes.map((node: AbstractNode) => afxFormatter.visitAbstractNode(node)).join("\n")

console.log(formatted)