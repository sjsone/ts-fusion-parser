import NodeFs from 'fs'
import { ObjectFunctionPathNode } from './eel/nodes/ObjectFunctionPathNode'
import { ObjectPathNode } from './eel/nodes/ObjectPathNode'
import { ObjectTreeParser } from "./lib"

const fusion = `
prototype(Neos.Fusion:Component).@class = "Neos\\Fusion\\FusionObjects\\ComponentImplementation"

prototype(Test.Tset:Component) { 
    test = afx\`
        <div test={props.asdf}> test asdf {props.end} 
            asdf {props.asdf}
        </div>
    \`

    value = afx\`
        {"{"}
        <Neos.Fusion:Loop items={props.properties}>
            {itemKey}: {item}
        </Neos.Fusion:Loop>
        {"}"}
    \`

    renderer = \${this.test}
    @if.test = \${props.test}
}
`


const fusionPath = "/Users/simon/Downloads/bauwerk-capital-website-master/source/DistributionPackages/BauwerkCapital.Website/Resources/Private/Fusion/Integration/Content/BlogCardRow.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusionFile
const timeStart = process.hrtime();
const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, false)
const timeEnd = process.hrtime(timeStart);
console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
console.log(objectTree.nodesByType.keys())

for(const objectPathNode of <ObjectPathNode[]><unknown>(objectTree.nodesByType.get(ObjectPathNode)!)) {
    const value = objectPathNode["value"]
    const substring = fusionToParse.substring(objectPathNode["position"].begin, objectPathNode["position"].end)
    if(value !== substring) console.log(value, substring)
}
