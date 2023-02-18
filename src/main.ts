import NodeFs from 'fs'
import { Comment } from './common/Comment'
import { TagNode } from './dsl/afx/nodes/TagNode'
import { ObjectFunctionPathNode } from './dsl/eel/nodes/ObjectFunctionPathNode'
import { ObjectNode } from './dsl/eel/nodes/ObjectNode'
import { ObjectPathNode } from './dsl/eel/nodes/ObjectPathNode'
import { FusionFormatter } from './fusion/FusionFormatter'
import { PathSegment } from './fusion/nodes/PathSegment'
import { ObjectTreeParser } from "./lib"

const fusion = `
prototype(Test.Tset:Component) < prototype(Neos.Fusion:Component) { 
    // @fusion-ignore
    test = Neos.Fusion:DataStructure {
        a
    }   
}
`

// renderer = afx\`
//         <!--  @fusion-ignore -->
//  		<div><p>asdf</p></div>
//         <div>
//     \`

const fusionPath = "./data/eel.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusionFile
const timeStart = process.hrtime();
const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, true)
const timeEnd = process.hrtime(timeStart);
console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
// console.log(objectTree.nodesByType.get(ObjectNode))

// for(const objectPathNode of <ObjectNode[]><unknown>(objectTree.nodesByType.get(ObjectNode)!)) {
//     // const value = objectPathNode["value"]
//     const substring = fusionToParse.substring(objectPathNode["position"].begin, objectPathNode["position"].end)
//     // if(value !== substring) console.log(value, substring)
//     console.log("substring", substring)
// }

// for(const test of <Comment[]><unknown>(objectTree.nodesByType.get(Comment)!)) {
//     console.log(test)
// }


const fusionFormatter = new FusionFormatter()
const formattedFusion = fusionFormatter.visitAbstractNode(objectTree)

console.log(formattedFusion)


