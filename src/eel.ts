import { EELParser } from "./core/eel/parser"

const testMultiLineString = `\${'
        <svg class="test">
            
        </svg>
    '}
`
const testSingleLineString = `\${"test{(asdf)}"}`
const testSingleLineHelperString = `\${FD.Debug.dumpDie("test")}`
const testSingleLineHelperStringSuffix = `\${FD.Debug.dumpDie("test").test}`
const testSingleLineHelperMultiString = `\${FD.Debug.dumpDie("test", "tset")}`
const testSingleLineHelperWithHelper = `\${FD.Debug.dumpDie(test())}`
const testSingleLineHelperWithObjectName = `\${FD.Debug.dumpDie(this.test)}`
const testSingleLineHelperWithObjectNameAndHelperAndString = `\${FD.Debug.dumpDie(this.test, test(), "asdf")}`

const testComplexMultiLine = `\${
    PropTypes.dataStructure({
        'Inline': PropTypes.dataStructure({
            'CSS': PropTypes.string,
            'JS': PropTypes.string,
            'MJS': PropTypes.string,
            'HTML': PropTypes.string
        }),
        'File': PropTypes.dataStructure({
            'CSS': PropTypes.string,
            'JS': PropTypes.string,
            'MJS': PropTypes.string,
            'PRELOADASSET': PropTypes.string,
            'PRELOADCSS': PropTypes.string,
            'PRELOADSCRIPT': PropTypes.string,
            'MODULEPRELOAD': PropTypes.string
        })
    }).isRequired
}`

const testMultipleTails = `\${
    PropTypes.dataStructure().PropTypes.dataStructure().PropTypes.dataStructure()
}`

const parsedEEl = EELParser.parseFromFusion(testMultipleTails)

console.dir(parsedEEl)


