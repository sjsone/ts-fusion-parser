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
const testSingleArray = `\${['available', 'reserved']}`


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

const simpleCallback = `\${
    Array.filter(this.anchorItems, (item, index) => item.availableProperties != null)
}`

const skipOnError = `\${
    (q(node).property('projects') && Array.length(q(node).property('projects'))) ? Array.slice(q(node).property('projects'), 0, 4) : null
}

test = asdf
`

const parsedEEl = EELParser.parseFromFusion(testMultipleTails)
console.log(parsedEEl.eel)
