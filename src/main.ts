import NodeFs from 'fs'
import { TagNode } from './afx/nodes/TagNode'
import { ObjectFunctionPathNode } from './eel/nodes/ObjectFunctionPathNode'
import { ObjectNode } from './eel/nodes/ObjectNode'
import { ObjectPathNode } from './eel/nodes/ObjectPathNode'
import { ObjectTreeParser } from "./lib"

const fusion = `
prototype(Test.Tset:Component) { 
    renderer = afx\`
 		<div></div>
        <div>
    \`
}
`


const fusionPath = "./data/eel.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusion
const timeStart = process.hrtime();
const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, false)
const timeEnd = process.hrtime(timeStart);
console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
// console.log(objectTree.nodesByType.get(ObjectNode))

// for(const objectPathNode of <ObjectNode[]><unknown>(objectTree.nodesByType.get(ObjectNode)!)) {
//     // const value = objectPathNode["value"]
//     const substring = fusionToParse.substring(objectPathNode["position"].begin, objectPathNode["position"].end)
//     // if(value !== substring) console.log(value, substring)
//     console.log("substring", substring)
// }

for(const test of <TagNode[]><unknown>(objectTree.nodesByType.get(TagNode)!)) {
    console.log(test)
}
