import { ControllerContext } from "./core/controllerContext";
import { Parser } from "./core/parser";
import { Runtime } from "./core/runtime";
import NodeFs from 'fs'

/**
 * View for using Fusion for standard MVC controllers.
 *
 * Recursively loads all Fusion files from the configured path (By default that's Resources/Private/Fusion
 * of the current package) and then checks whether a Fusion object for current controller and action can be found.
 *
 * If the controller class name is Foo\Bar\Baz\Controller\BlahController and the action is "index",
 * it checks for the Fusion path Foo.Bar.Baz.BlahController.index.
 * If this path is found, then it is used for rendering.
 */
export class FusionView
{
    /**
     * This contains the supported options, their default values, descriptions and types.
     *
     * @var array
     */
    protected supportedOptions = {
        'fusionPathPatterns': [['resource://@package/Private/Fusion'], 'Fusion files that will be loaded if directories are given the Root.fusion is used.', 'array'],
        'fusionPath': [null, 'The Fusion path which should be rendered; derived from the controller and action names or set by the user.', 'string'],
        'packageKey': [null, 'The package key where the Fusion should be loaded from. If not given, is automatically derived from the current request.', 'string'],
        'debugMode': [false, 'Flag to enable debug mode of the Fusion runtime explicitly (overriding the global setting).', 'boolean'],
        'enableContentCache': [false, 'Flag to enable content caching inside Fusion (overriding the global setting).', 'boolean']
    }

    /**
     * @Flow\Inject
     * @var Parser
     */
    protected fusionParser: Parser = <Parser><unknown>undefined;

    /**
     * The parsed Fusion array in its internal representation
     *
     * @var array
     */
    protected parsedFusion: any;

    /**
     * Runtime cache of the Fusion path which should be rendered; derived from the controller
     * and action names or set by the user.
     *
     * @var string
     */
    protected fusionPath = null;

    /**
     * The Fusion Runtime
     *
     * @var Runtime
     */
    protected fusionRuntime: Runtime =  <Runtime><unknown>undefined;

    protected options: {[key: string]: any}= {}

    constructor() {
        this.fusionParser = new Parser
    }

    /**
     * Reset runtime cache if an option is changed
     *
     * @param string optionName
     * @param mixed value
     * @return void
     */
    public setOption(optionName: string, value: any)
    {
        this.fusionPath = null;
    }

    /**
     * Sets the Fusion path to be rendered to an explicit value;
     * to be used mostly inside tests.
     *
     * @param string fusionPath
     * @return void
     */
    public setFusionPath(fusionPath: string)
    {
        this.setOption('fusionPath', fusionPath);
    }

    /**
     * The package key where the Fusion should be loaded from. If not given,
     * is automatically derived from the current request.
     *
     * @param string packageKey
     * @return void
     */
    public setPackageKey(packageKey: string)
    {
        this.setOption('packageKey', packageKey);
    }

    /**
     * @param string pathPattern
     * @return void
     */
    public setFusionPathPattern(pathPattern: string)
    {
        this.setOption('fusionPathPatterns', [pathPattern]);
    }

    /**
     * @param array pathPatterns
     * @return void
     */
    public setFusionPathPatterns(pathPatterns: any[])
    {
        this.setOption('fusionPathPatterns', pathPatterns);
    }

    /**
     * Render the view
     *
     * @return mixed The rendered view
     * @api
     */
    public render()
    {
        this.initializeFusionRuntime();
        return this.renderFusion();
    }

    /**
     * Load the Fusion Files form the defined
     * paths and construct a Runtime from the
     * parsed results
     *
     * @return void
     */
    public initializeFusionRuntime()
    {
        if (!this.fusionRuntime) {
            this.loadFusion();
            this.fusionRuntime = new Runtime(this.parsedFusion, new ControllerContext);
        }
        // if (this.options['debugMode'] !== undefined) {
        //     this.fusionRuntime.setDebugMode(this.options['debugMode']);
        // }
        // if (isset(this.options['enableContentCache'])) {
        //     this.fusionRuntime.setEnableContentCache(this.options['enableContentCache']);
        // }
    }

    /**
     * Load Fusion from the directories specified by this.getOption('fusionPathPatterns')
     *
     * @return void
     */
    protected loadFusion()
    {
        this.parsedFusion = this.getMergedFusionObjectTree();
    }

    /**
     * Parse all the fusion files the are in the current fusionPathPatterns
     *
     * @return array
     */
    protected getMergedFusionObjectTree(): any
    {
        let parsedFusion = {};
        for (const fusion of this.getRawFusion()) {
            parsedFusion = this.fusionParser.parse(fusion, 'root', parsedFusion);
        }
        return parsedFusion;
    }

    protected getRawFusion() {
        return [
            NodeFs.readFileSync('data/case.fusion').toString()
        ]
    }

    protected renderFusion()
    {
        let output
        this.fusionRuntime.pushContextArray([]);
        try {
            output = this.fusionRuntime.render("root");
        } catch (exception) {
            throw exception
        }
        this.fusionRuntime.popContext();
        return output;
    }
}
