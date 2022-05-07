import { Lexer } from "./lexer"
import { ObjectTreeParser } from "./objectTreeParser"
import { Token } from "./token"

const fusion = `prototype(Test.Tset:Component) < prototype(Internal.Base:Component) { 
    renderer = false 
    test = afx\`
        <div>test</div>
    \`

    @if.test = \${props.test}
}
`

const objectTreeParser = ObjectTreeParser.parse(fusion)


console.log(JSON.stringify(objectTreeParser.statementList.statements, undefined, 4))