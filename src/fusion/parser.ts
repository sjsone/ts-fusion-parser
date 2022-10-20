import NodeFs from 'fs'
import NodePath from 'path'
import { FusionFile } from "./objectTreeParser/ast/FusionFile";
import { MergedArrayTree } from "./objectTreeParser/mergedArrayTree";
import { MergedArrayTreeVisitor } from "./objectTreeParser/mergedArrayTreeVisitor";
import { ObjectTreeParser } from "./objectTreeParser/objectTreeParser";

export class Parser {
    /**
     * Reserved parse tree keys for internal usage.
     */
    public static reservedParseTreeKeys = ['__meta', '__prototypes', '__stopInheritanceChain', '__prototypeObjectName', '__prototypeChain', '__value', '__objectType', '__eelExpression'];

    /**
     * @Flow\Inject
     * @var DslFactory
     */
    protected dslFactory: any;

    constructor() {
        this.dslFactory = undefined
    }

    /**
     * Parses the given Fusion source code, resolves includes and returns a merged array tree
     * as the result.
     *
     * @param string sourceCode The Fusion source code to parse
     * @param string|undefined contextPathAndFilename An optional path and filename used for relative Fusion file includes
     * @param array mergedArrayTreeUntilNow Used internally for keeping track of the built merged array tree
     * @return array The merged array tree for the Fusion runtime, generated from the source code
     * @throws Fusion\Exception
     * @api
     */
    public parse(sourceCode: string, contextPathAndFilename: string|undefined = undefined, mergedArrayTreeUntilNow: { [key: string]: any } = {}) {
        const fusionFile = this.getFusionFile(sourceCode, contextPathAndFilename);

        // console.log("fusionFile")
        // fusionFile.debugPrint('', false)

        let mergedArrayTree = new MergedArrayTree(mergedArrayTreeUntilNow);

        mergedArrayTree = this.getMergedArrayTreeVisitor(mergedArrayTree).visitFusionFile(fusionFile);
        // console.log("mergedArrayTree", mergedArrayTree)

        mergedArrayTree.buildPrototypeHierarchy();
        return mergedArrayTree.getTree();
    }

    protected handleFileInclude( mergedArrayTree: MergedArrayTree,  filePattern: string, contextPathAndFilename: string|undefined): void {
        // const filesToInclude = FilePatternResolver.resolveFilesByPattern(filePattern, contextPathAndFilename, '.fusion');
        const filesToInclude: any[] = []
        for(const file of filesToInclude) {

            try {
                NodeFs.accessSync(file, NodeFs.constants.R_OK)
            } catch(error) {
                throw new Error("Could not read file 'file' of pattern 'filePattern'.")
                // throw new Fusion\Exception("Could not read file 'file' of pattern 'filePattern'.", 1347977017);
            }
            // TODO: Check if not trying to recursively include the current file via globbing
            if (contextPathAndFilename === undefined /* || stat(contextPathAndFilename) !== stat(file) */) {
                const fusionFile = this.getFusionFile(NodeFs.readFileSync(file).toString(), file);
                this.getMergedArrayTreeVisitor(mergedArrayTree).visitFusionFile(fusionFile);
            }
        }
    }

    protected handleDslTranspile(identifier: string, code: string) {
        // TODO: Cache me
        // const dslObject = this.dslFactory.create(identifier);
        // const transpiledFusion = dslObject.transpile(code);
        return ""
        const transpiledFusion = '${"'+code+'"}'
        const fusionFile = ObjectTreeParser.parse('value = '+transpiledFusion);
        const mergedArrayTree = this.getMergedArrayTreeVisitor(new MergedArrayTree({})).visitFusionFile(fusionFile);
        const temporaryAst = mergedArrayTree.getTree();
        const dslValue = temporaryAst['value'];

        return dslValue;
    }

    protected getMergedArrayTreeVisitor( mergedArrayTree: MergedArrayTree): MergedArrayTreeVisitor {
        return new MergedArrayTreeVisitor(
            mergedArrayTree,
            (mergedArrayTree: MergedArrayTree,  filePattern: string, contextPathAndFilename: string|undefined) => this.handleFileInclude(mergedArrayTree, filePattern, contextPathAndFilename),
            (identifier: string, code: string) => this.handleDslTranspile(identifier, code)
        );
    }

    protected getFusionFile( sourceCode: string,  contextPathAndFilename: string|undefined): FusionFile {
        // TODO: Cache me
        return ObjectTreeParser.parse(sourceCode, contextPathAndFilename)
    }
}