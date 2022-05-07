export class Parser {
    /**
     * Reserved parse tree keys for internal usage.
     */
    public static reservedParseTreeKeys = ['__meta', '__prototypes', '__stopInheritanceChain', '__prototypeObjectName', '__prototypeChain', '__value', '__objectType', '__eelExpression'];

    /**
     * @Flow\Inject
     * @var DslFactory
     */
    protected dslFactory;

    /**
     * @Flow\Inject
     * @var ParserCache
     */
    protected parserCache;

    /**
     * Parses the given Fusion source code, resolves includes and returns a merged array tree
     * as the result.
     *
     * @param string sourceCode The Fusion source code to parse
     * @param string|null contextPathAndFilename An optional path and filename used for relative Fusion file includes
     * @param array mergedArrayTreeUntilNow Used internally for keeping track of the built merged array tree
     * @return array The merged array tree for the Fusion runtime, generated from the source code
     * @throws Fusion\Exception
     * @api
     */
    public parse(sourceCode: string, contextPathAndFilename = null, mergedArrayTreeUntilNow = []) {
        const fusionFile = this.getFusionFile(sourceCode, contextPathAndFilename);

        const mergedArrayTree = new MergedArrayTree(mergedArrayTreeUntilNow);

        mergedArrayTree = this.getMergedArrayTreeVisitor(mergedArrayTree).visitFusionFile(fusionFile);

        mergedArrayTree.buildPrototypeHierarchy();
        return mergedArrayTree.getTree();
    }

    protected handleFileInclude(MergedArrayTree mergedArrayTree, string filePattern, ?string contextPathAndFilename): void {
        filesToInclude = FilePatternResolver. resolveFilesByPattern(filePattern, contextPathAndFilename, '.fusion');
        foreach(filesToInclude as file) {
            if (is_readable(file) === false) {
                throw new Fusion\Exception("Could not read file 'file' of pattern 'filePattern'.", 1347977017);
            }
            // Check if not trying to recursively include the current file via globbing
            if (contextPathAndFilename === null
                || stat(contextPathAndFilename) !== stat(file)) {
                fusionFile = this.getFusionFile(file_get_contents(file), file);
                this.getMergedArrayTreeVisitor(mergedArrayTree).visitFusionFile(fusionFile);
            }
        }
    }

    protected handleDslTranspile(string identifier, string code) {
        return this.parserCache.cacheForDsl(
            identifier,
            code,
            () => {
                const dslObject = this.dslFactory.create(identifier);
                const transpiledFusion = dslObject.transpile(code);
                const fusionFile = ObjectTreeParser. parse('value = '.transpiledFusion);
                const mergedArrayTree = this.getMergedArrayTreeVisitor(new MergedArrayTree()).visitFusionFile(fusionFile);
                const temporaryAst = mergedArrayTree.getTree();
                const dslValue = temporaryAst['value'];

                return dslValue;
            }
        );
    }

    protected getMergedArrayTreeVisitor(MergedArrayTree mergedArrayTree): MergedArrayTreeVisitor {
        return new MergedArrayTreeVisitor(
            mergedArrayTree,
            (...args: any) => this.handleFileInclude(...args),
            (...args: any) => this.handleDslTranspile(...args)
        );
    }

    protected getFusionFile( sourceCode,  contextPathAndFilename): FusionFile {
        return this.parserCache.cacheForFusionFile(
            contextPathAndFilename,
            () => ObjectTreeParser.parse(sourceCode, contextPathAndFilename)
        );
    }
}