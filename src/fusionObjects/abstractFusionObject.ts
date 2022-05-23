import { Runtime } from "../core/runtime";

export abstract class AbstractFusionObject
{
    /**
     * @var Runtime
     */
    protected runtime: Runtime;

    /**
     * The Fusion path currently being rendered
     *
     * @var string
     */
    protected path;

    /**
     * Name of this Fusion object, like Neos.Neos:Text
     *
     * @var string
     */
    protected fusionObjectName;

    /**
     * @var array
     */
    protected fusionValueCache = [];

    /**
     * Constructor
     *
     * @param Runtime runtime
     * @param string path
     * @param string fusionObjectName
     */
    public constructor(runtime: Runtime, path: string, fusionObjectName: string)
    {
        this.runtime = runtime;
        this.path = path;
        this.fusionObjectName = fusionObjectName;
    }

    /**
     * Evaluate this Fusion object and return the result
     *
     * @return mixed
     */
    public abstract evaluate(): any;

    /**
     * Get the Fusion runtime this object was created in.
     *
     * @return Runtime
     */
    public getRuntime()
    {
        return this.runtime;
    }

    /**
     * Return the Fusion value relative to this Fusion object (with processors etc applied).
     *
     * Note that subsequent calls of fusionValue() with the same Fusion path will return the same values since the
     * first evaluated value will be cached in memory.
     *
     * @param string path
     * @return mixed
     */
    protected fusionValue(path: string)
    {
        const fullPath = this.path + '/' + path;
        console.log("[fusionValue] fullPath", fullPath)
        // TODO: Cache it
        return this.runtime.evaluate(fullPath, this)
    }
}
