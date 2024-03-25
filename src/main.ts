import NodeFs from 'fs'
import { Comment } from './common/Comment'
import { TagNode } from './dsl/afx/nodes/TagNode'
import { AfxParserOptions } from './dsl/afx/parser'
import { ObjectFunctionPathNode } from './dsl/eel/nodes/ObjectFunctionPathNode'
import { ObjectNode } from './dsl/eel/nodes/ObjectNode'
import { ObjectPathNode } from './dsl/eel/nodes/ObjectPathNode'
import { EelParserOptions } from './dsl/eel/parser'
import { PathSegment } from './fusion/nodes/PathSegment'
import { FusionParserOptions, ObjectTreeParser } from "./lib"
import { DslExpressionValue } from './fusion/nodes/DslExpressionValue'
import { DocumentationSingleLine } from './fusion/nodes/DocumentationSingleLine'
import { DocumentationMultiLine } from './fusion/nodes/DocumentationMultiLine'

const eelParserOptions: EelParserOptions = {
    allowIncompleteObjectPaths: true
}

const afxParserOptions: AfxParserOptions = {
    eelParserOptions,
    allowUnclosedTags: true
}

const fusionParserOptions: FusionParserOptions = {
    eelParserOptions,
    afxParserOptions,
    ignoreErrors: true
}

const fusion = `
renderer = \${props.eeltest ? "left" : "right"}
`


const fusionPath = "./data/test.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusionFile
const timeStart = process.hrtime();
const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, fusionParserOptions)
const timeEnd = process.hrtime(timeStart);
console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)

for (const singleLine of objectTree.getNodesByType(DocumentationSingleLine) ?? []) {
    console.log("singleLine", singleLine.value, singleLine["followingStatement"]?.toString())
}
for (const multiLine of objectTree.getNodesByType(DocumentationMultiLine) ?? []) {
    console.log("multiLine", multiLine.value, multiLine["followingStatement"]?.toString())
}


// console.log(objectTree)
// const dslExpressionValue = <DslExpressionValue>objectTree.statementList.statements[0].operation.pathValue
// console.log(dslExpressionValue.htmlNodes[1].content.map(c => ({
//     name: c.constructor.name,
//     text: c["text"] 
// })))

// console.log(dslExpressionValue.htmlNodes[1].content)
