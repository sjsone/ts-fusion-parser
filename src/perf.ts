import NodeFs from 'fs'
import { AfxParserOptions } from './dsl/afx/parser'
import { EelParserOptions } from './dsl/eel/parser'
import { FusionParserOptions, ObjectTreeParser } from "./lib"

const eelParserOptions: EelParserOptions = {
    allowIncompleteObjectPaths: false
}

const afxParserOptions: AfxParserOptions = {
    eelParserOptions,
    allowUnclosedTags: false
}

const fusionParserOptions: FusionParserOptions = {
    eelParserOptions,
    afxParserOptions,
    ignoreErrors: false
}


const fusionPath = "./data/test.fusion"
const fusionFile = NodeFs.readFileSync(fusionPath).toString()

const fusionToParse = fusionFile
// const timeStart = process.hrtime();

for(let i = 0; i < 5000; i++) {
    const objectTree = ObjectTreeParser.parse(fusionToParse, undefined, fusionParserOptions)
}

// const timeEnd = process.hrtime(timeStart);
// console.info('Execution time: %ds %dms', timeEnd[0], timeEnd[1] / 1000000)
