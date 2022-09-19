import NodeFs from 'fs'
import { ObjectTreeParser } from "./core/objectTreeParser/objectTreeParser"

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

const fusionFile = NodeFs.readFileSync('./data/test.fusion').toString()

const objectTreeParser = ObjectTreeParser.parse(fusionFile)
//console.log(JSON.stringify(objectTreeParser.statementList.statements, undefined, 4))
objectTreeParser.statementList.debugPrint('', false)

// const fusionAst = (new Parser()).parse(fusion);
// console.log("fusionAst", JSON.stringify(fusionAst.__prototypes, undefined, 4))
