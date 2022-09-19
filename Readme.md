# Neos Fusion Parser

## Example

```typescript
import NodeFs from 'fs'
import { ObjectTreeParser } from "ts-fusion-parser"

const fusionFile = NodeFs.readFileSync('path/to/your/file.fusion').toString()

// If you only want to get the structure
const objectTree = ObjectTreeParser.parse(fusionFile)
objectTree.statementList.debugPrint()

// To get the AST
const fusionAst = (new Parser()).parse(fusionFile);
console.log("fusionAst", JSON.stringify(fusionAst.__prototypes, undefined, 4))
```
