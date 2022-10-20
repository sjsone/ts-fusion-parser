import { Lexer } from "./eel/lexer"
import { Parser } from "./eel/parser"

const tests: { [key: string]: string } = {
    SingleLineString: `"test{(asdf)}"`,
    MultiLineString: `'
        <svg class="test">
            
        </svg>
    '
    `,
    SingleLineHelperString: `FD.Debug.dumpDie("test")`,
    SingleLineHelperStringSuffix: `FD.Debug.dumpDie("test").test`,
    SingleLineHelperMultiString: `FD.Debug.dumpDie("test", "tset")`,
    SingleLineHelperWithHelper: `FD.Debug.dumpDie(test())`,
    SingleLineHelperWithObjectName: `FD.Debug.dumpDie(this.test)`,
    SingleLineHelperWithObjectNameAndHelperAndString: `FD.Debug.dumpDie(this.test, empty(), "asdf")`,
    ComplexMultiLine: `
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
    `,
    MultipleTails: `
    PropTypes.dataStructure().PropTypes.dataStructure().PropTypes.dataStructure()
    `,
    ArrayLiteral: ` [ "asfd"    , String.toUpper('here')]`,
    Addition: `q(node).property('title') + ' ' + q(node).property('title2')`,
    NumberInArgs: `q(site).find('#' + Configuration.setting('BauwerkCapital.Website.nodeStructure.magazine')).get(0)`,
    FloatInArgs: `Test.asdf(1.4)`,

    Ternary: `request.arguments.categories ? request.arguments.categories : []`,
    LogicalOr: `props.canBe || props.maybe`,
    LogicalAnd: `!(props.canBe && !props.maybe)`,
    OffsetAccess: `String.split("Hello world!", ' ')[1]`,
    OffsetAccessCalc: `items[index + 1]`,
    OffsetWithOffset: `owo[1][2]`,
    OffsetAccessComplex: `items[index + 1 + Test.Helper[1]][2]`
}


const runAllTests = () => {
    const failedTests: { name: string, text: string, error: Error }[] = []
    for (const name in tests) {
        const text = tests[name]
        try {
            const lexer = new Lexer(text)
            const parser = new Parser(lexer)
            const result = parser.parse()            
        } catch (error) { failedTests.push({ name, text, error: <Error>error }) }
    }

    for (const test of failedTests) {
        console.log("Name", test.name)
        console.log(test.error.message, test.error.stack)
        console.log("\n\n")
    }

}
// runAllTests()
const lexer = new Lexer(tests.MultipleTails)
const parser = new Parser(lexer)
const result = parser.parse()   
console.log(result.path[1])
// console.log(">"+tests.MultipleTails.substring(30, 36)+"<")