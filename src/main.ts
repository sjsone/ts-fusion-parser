import NodeFs from 'fs'

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

const fusionFile = NodeFs.readFileSync('./test.fusion').toString()

const objectTreeParser = ObjectTreeParser.parse(fusionFile)
// console.log(JSON.stringify(objectTreeParser.statementList.statements, undefined, 4))
objectTreeParser.statementList.debugPrint('', false)