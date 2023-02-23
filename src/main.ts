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
prototype(Test.Tset:Component) { 
    // @fusion-ignore
    test = Neos.Fusion:DataStructure {
        // a
    }
    renderer = afx\`
        <!--  @fusion-ignore -->
 		<div>{props.}</div>
        <div>
    \`
}
`


const fusionPath = "./data/eel.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusion
const timeStart = process.hrtime();
const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, fusionParserOptions)
const timeEnd = process.hrtime(timeStart);
console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
// console.log(objectTree.nodesByType.get(ObjectNode))

// for(const objectPathNode of <ObjectNode[]><unknown>(objectTree.nodesByType.get(ObjectNode)!)) {
//     // const value = objectPathNode["value"]
//     const substring = fusionToParse.substring(objectPathNode["position"].begin, objectPathNode["position"].end)
//     // if(value !== substring) console.log(value, substring)
//     console.log("substring", substring)
// }

for (const test of <Comment[]><unknown>(objectTree.nodesByType.get(Comment)!)) {
    console.log(test)
}
