import NodeFs from 'fs'
import { AfxParserOptions } from './dsl/afx/parser'
import { EelParserOptions } from './dsl/eel/parser'
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


const fusionPath = "./data/test.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusionFile
// const timeStart = process.hrtime();

for(let i = 0; i < 3000; i++) {
    const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, fusionParserOptions)
}

// const timeEnd = process.hrtime(timeStart);
// console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
