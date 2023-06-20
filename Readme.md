# Neos Fusion Parser

Based on the official `Neos.Fusion` [parser](https://github.com/neos/neos-development-collection/tree/master/Neos.Fusion/Classes/Core)

AFX & EEL Parsers are new.

## Disclaimer

This is currently under active development primarily for the [Neos Fusion VSCode Extension](https://marketplace.visualstudio.com/items?itemName=SimonSchmidt.vscode-neos-fusion-lsp).

## Example

```typescript
import { FusionParserOptions, ObjectTreeParser } from 'ts-fusion-parser'
import { TagNode } from 'ts-fusion-parser/out/dsl/afx/nodes/TagNode'
import { AfxParserOptions } from 'ts-fusion-parser/out/dsl/afx/parser'
import { EelParserOptions } from 'ts-fusion-parser/out/dsl/eel/parser'
import { StringValue } from 'ts-fusion-parser/out/fusion/nodes/StringValue'

const eelParserOptions: EelParserOptions = {
    // this allows for `<div>{props.}</div>` to be parsed as `<div>{props}</div>`
    allowIncompleteObjectPaths: true
}

const afxParserOptions: AfxParserOptions = {
    eelParserOptions,
    // this auto-closes left open tags in the end
    allowUnclosedTags: true
}

const fusionParserOptions: FusionParserOptions = {
    eelParserOptions,
    afxParserOptions,
    // save Errors in the `FusionFile.errors` array instead of throwing
    ignoreErrors: true
}

const fusion = `
prototype(Vendor.Website:Component) < prototype(Neos.Fusion:Component) {
    text = "bla"

    renderer = afx\`
 		<div>{props.text}</div>
    \`
}
`

// not really used currently
const contextPathAndFileName = undefined
const fusionFile = ObjectTreeParser.parse(fusion, contextPathAndFileName, fusionParserOptions)

const stringValues = fusionFile.getNodesByType(StringValue)
console.log("text: ", stringValues?.[0].value, stringValues?.[0].value === "bla")

const tagNodes = fusionFile.getNodesByType(TagNode)
// as this is currently WIP there is no real public API specified so a lot of properties are still `protected`
console.log("tag node: ", tagNodes?.[0]["name"], tagNodes?.[0]["name"] === "true")
```
