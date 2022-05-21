import NodeFs from 'fs'
import { ControllerContext } from './core/controllerContext'

import { Lexer } from "./core/lexer"
import { ObjectTreeParser } from "./core/objectTreeParser/objectTreeParser"
import { Parser } from './core/parser'
import { Runtime } from './core/runtime'
import { Token } from "./core/token"
import { ComponentImplementation } from './fusionObjects/componentImplementation'
import { FusionObjectManager } from './fusionObjects/fusionObjectManager'
import { FusionView } from './fusionView'




// const consoleLog = console.log
// console.log = (...messages) => {
//     const mainMessage = messages.shift()
//     consoleLog((messages.length > 0 ? `[${mainMessage}]` : mainMessage))
//     for(const message of messages) {
//         consoleLog(message)
//     }
//     if(messages.length > 0) {
//         consoleLog("\n")
//     }
// }



const fusion = `
prototype(Neos.Fusion:Component).@class = "Neos\\Fusion\\FusionObjects\\ComponentImplementation"

prototype(Test.Tset:Component) { 
    test = afx\`
        <div>test</div>
    \`

    renderer = \${this.test}
    @if.test = \${props.test}
}
`
FusionObjectManager.set('Neos\\Fusion\\FusionObjects\\ComponentImplementation', ComponentImplementation)

const fusionFile = NodeFs.readFileSync('./test.fusion').toString()

// const objectTreeParser = ObjectTreeParser.parse(fusion)
// //console.log(JSON.stringify(objectTreeParser.statementList.statements, undefined, 4))
// objectTreeParser.statementList.debugPrint('', false)

// const fusionAst = (new Parser()).parse(fusion);
// console.log("fusionAst", JSON.stringify(fusionAst.__prototypes, undefined, 4))

const fusionView = new FusionView

console.log(fusionView.render())