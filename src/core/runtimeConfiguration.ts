import { type } from "os";
import path from "path";
import { Arrays } from "./arrays";

export class RuntimeConfiguration
{

    /**
     * The parsed Fusion configuration
     *
     * @var {[key: string]: any}
     */
    private fusionConfiguration;

    /**
     * @var {[key: string]: any}
     */
    private pathCache: {[key: string]: any} = {};

    /**
     * @var \Closure
     */
    private simpleTypeToArrayClosure;

    /**
     * @var \Closure
     */
    private shouldOverrideFirstClosure;

    public constructor(fusionConfiguration: {[key: string]: any})
    {
        this.fusionConfiguration = fusionConfiguration;

        this.simpleTypeToArrayClosure = (simpleType: any) => {
            return simpleType === null ? null : {
                '__eelExpression': null,
                '__value': simpleType,
                '__objectType': null
            };
        };

        this.shouldOverrideFirstClosure = (key: string, firstValue: any, secondValue: any): boolean => {
            return typeof secondValue === "object"  && secondValue.__stopInheritanceChain !== undefined;
        };
    }

    /**
     * Get the expanded Fusion configuration for the given path
     *
     * @param string fusionPath
     * @return {[key: string]: any}
     * @throws Exception
     */
    public forPath(fusionPath: string): {[key: string]: any}
    {
        // Fast path if complete Fusion path is in configuration cache
        // if (this.pathCache[fusionPath] !== undefined) {
        //     return this.pathCache[fusionPath]['c'];
        // }

        let configuration
        let currentPrototypeDefinitions

        // Find longest prefix of path that already is in path cache
        let pathUntilNow = '';
        // const fusionPathLength = fusionPath.length;
        // let offset = fusionPathLength;
        // // TODO: Fix negative position in lastIndexOf
        // while ((offset = fusionPath.lastIndexOf('/', -(fusionPathLength - offset + 1))) != -1) {
        //     const pathPrefix = fusionPath.substring(0, offset);
        //     if (this.pathCache[pathPrefix] !== undefined) {
        //         pathUntilNow = pathPrefix;
        //         configuration = this.pathCache[pathPrefix]['c'];
        //         currentPrototypeDefinitions = this.pathCache[pathUntilNow]['p'];
        //         break;
        //     }
        // }

        // No prefix was found, build configuration for path from the root
        if (pathUntilNow === '') {
            configuration = this.fusionConfiguration;
            currentPrototypeDefinitions = {};
            if (configuration['__prototypes'] !== undefined) {
                currentPrototypeDefinitions = configuration['__prototypes'];
            }
        }

        console.log("currentPrototypeDefinitions", currentPrototypeDefinitions)

        // Build configuration for the remaining path parts
        let remainingPath = fusionPath.substring( pathUntilNow === '' ? 0 : pathUntilNow.length + 1);
        console.log("remainingPath start", remainingPath)
        let pathParts = remainingPath.split('/');
        for (const pathPart of pathParts) {
            if (pathUntilNow === '') {
                pathUntilNow = pathPart;
            } else {
                pathUntilNow += '/' + pathPart;
            }
            if (this.pathCache[pathUntilNow] !== undefined) {
                configuration = this.pathCache[pathUntilNow]['c'];
                currentPrototypeDefinitions = this.pathCache[pathUntilNow]['p'];
                continue;
            }
            configuration = this.matchCurrentPathPart(pathPart, configuration, currentPrototypeDefinitions);
            // this.pathCache[pathUntilNow]['c'] = configuration;
            //this.pathCache[pathUntilNow]['p'] = currentPrototypeDefinitions;
        }

        console.log("return [configuration]", configuration)

        return configuration;
    }

    /**
     * Matches the current path segment and prepares the configuration.
     *
     * @param string pathPart
     * @param {[key: string]: any} previousConfiguration
     * @param {[key: string]: any} currentPrototypeDefinitions
     * @return {[key: string]: any}
     * @throws Exception
     */
    private matchCurrentPathPart(pathPart: string, previousConfiguration: {[key: string]: any} , currentPrototypeDefinitions: {[key: string]: any}): {[key: string]: any}
    {

        console.log("[matchCurrentPathPart]", pathPart, previousConfiguration ,currentPrototypeDefinitions)

        const matches = /^([^<]*)(<(.*?)>)?/.exec(pathPart)
        
        if (matches === null) {
            throw new Error('Path Part ' + pathPart + ' not well-formed');
        }

        let currentPathSegment = matches[1];
        let configuration: {[key: string]: any} = {};

        if (previousConfiguration[currentPathSegment] !== undefined) {
            configuration = typeof previousConfiguration[currentPathSegment] === "object" ? previousConfiguration[currentPathSegment] : this.simpleTypeToArrayClosure(previousConfiguration[currentPathSegment]);
        }

        if (configuration['__prototypes'] !== undefined) {
            // currentPrototypeDefinitions = Arrays.arrayMergeRecursiveOverruleWithCallback(
            //     currentPrototypeDefinitions,
            //     configuration['__prototypes'],
            //     this.simpleTypeToArrayClosure,
            //     this.shouldOverrideFirstClosure
            // );
            currentPrototypeDefinitions = configuration['__prototypes']
        }

        let currentPathSegmentType = null;
        if (configuration['__objectType'] !== undefined) {
            currentPathSegmentType = configuration['__objectType'];
        }
        if (matches[3] !== undefined) {
            currentPathSegmentType = matches[3];
        }

        if (currentPathSegmentType !== null) {
            configuration['__objectType'] = currentPathSegmentType;
            configuration = this.mergePrototypesWithConfigurationForPathSegment(
                configuration,
                currentPrototypeDefinitions
            );
        }

        if (typeof configuration === "object" && configuration['__value'] === undefined && configuration['__eelExpression'] === undefined && configuration['__meta']?.['class'] === undefined && configuration['__objectType'] === undefined && configuration['__meta']?.['process'] !== undefined) {
            configuration['__value'] = '';
        }

        return configuration;
    }

    /**
     * Merges the prototype chain into the configuration.
     *
     * @param {[key: string]: any} configuration
     * @param {[key: string]: any} currentPrototypeDefinitions
     * @return {[key: string]: any}
     * @throws Exception
     */
    private mergePrototypesWithConfigurationForPathSegment(configuration: {[key: string]: any} , currentPrototypeDefinitions: {[key: string]: any}): {[key: string]: any}
    {
        let currentPathSegmentType = configuration['__objectType'];

        if (currentPrototypeDefinitions[currentPathSegmentType] !== undefined) {
            let prototypeMergingOrder = [currentPathSegmentType];
            if (currentPrototypeDefinitions[currentPathSegmentType]['__prototypeChain'] !== undefined) {
                prototypeMergingOrder = Object.assign(
                    currentPrototypeDefinitions[currentPathSegmentType]['__prototypeChain'],
                    prototypeMergingOrder
                );
            }

            let currentPrototypeWithInheritanceTakenIntoAccount = [];

            for (const prototypeName of prototypeMergingOrder) {
                if (!(prototypeName in currentPrototypeDefinitions)) {
                    throw new Exception(sprintf(
                        'The Fusion object `%s` which you tried to inherit from does not exist. Maybe you have a typo on the right hand side of your inheritance statement for `%s`.',
                        prototypeName,
                        currentPathSegmentType
                    ), 1427134340);
                }

                currentPrototypeWithInheritanceTakenIntoAccount = Arrays::arrayMergeRecursiveOverruleWithCallback(
                    currentPrototypeWithInheritanceTakenIntoAccount,
                    currentPrototypeDefinitions[prototypeName],
                    this.simpleTypeToArrayClosure,
                    this.shouldOverrideFirstClosure
                );
            }

            // We merge the already flattened prototype with the current configuration (in that order),
            // to make sure that the current configuration (not being defined in the prototype) wins.
            configuration = Arrays::arrayMergeRecursiveOverruleWithCallback(
                currentPrototypeWithInheritanceTakenIntoAccount,
                configuration,
                this.simpleTypeToArrayClosure,
                this.shouldOverrideFirstClosure
            );

            // If context-dependent prototypes are set (such as prototype("foo").prototype("baz")),
            // we update the current prototype definitions.
            if (currentPrototypeWithInheritanceTakenIntoAccount['__prototypes'] !== undefined) {
                currentPrototypeDefinitions = Arrays::arrayMergeRecursiveOverruleWithCallback(
                    currentPrototypeDefinitions,
                    currentPrototypeWithInheritanceTakenIntoAccount['__prototypes'],
                    this.simpleTypeToArrayClosure,
                    this.shouldOverrideFirstClosure
                );
            }
        }

        return configuration;
    }

    /**
     * No API, internal use for testing
     *
     * @param string fusionPath
     * @return boolean
     * @internal
     */
    public isPathCached(fusionPath: string): boolean
    {
        return this.pathCache[fusionPath] !== undefined;
    }
}
