import NodeFs from 'fs'
import { ObjectFunctionPathNode } from './eel/nodes/ObjectFunctionPathNode'
import { ObjectNode } from './eel/nodes/ObjectNode'
import { ObjectPathNode } from './eel/nodes/ObjectPathNode'
import { ObjectTreeParser } from "./lib"

const fusion = `
prototype(Test.Tset:Component) { 
    renderer = afx\`
 		<Neos.Fusion:Tag
            tagName='a'
            attributes.href={props.link}
            attributes.target={props.target}
            omitClosingTag={TRUE}
            @if.hasLinkAndNotInBackend={props.hasLinkAndNotInBackend ? true : false}
        />
        {props.hasLinkAndNotInBackend ? '</a>' : false}
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

for(const objectPathNode of <ObjectNode[]><unknown>(objectTree.nodesByType.get(ObjectNode)!)) {
    // const value = objectPathNode["value"]
    const substring = fusionToParse.substring(objectPathNode["position"].begin, objectPathNode["position"].end)
    // if(value !== substring) console.log(value, substring)
    console.log("substring", substring)
}
