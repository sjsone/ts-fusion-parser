import { Arrays } from "./arrays"

const isset = (value: any) => {
    return value !== null && value !== undefined
}
export class RuntimeConfiguration {

    protected fusionConfiguration: { [key: string]: any }

    protected simpleTypeToArrayClosure = function (simpleType: any) {
        return simpleType === null ? null : {
            '__eelExpression': null,
            '__value': simpleType,
            '__objectType': null
        };
    };

    protected shouldOverrideFirstClosure = function (key: string, firstValue: any, secondValue: any): boolean {
        return secondValue !== null && secondValue !== undefined && typeof secondValue === "object" && '__stopInheritanceChain' in secondValue;
    };

    constructor(fusionConfiguration: { [key: string]: any }) {
        this.fusionConfiguration = fusionConfiguration

    }



    forPath(path: string) {
        const debug = false
        if(debug) console.group("[RuntimeConfiguration] forPath")

        // ^([^<]*)(<(.*?)>)?



        let pathParts = path.split('/')
        let configuration = this.fusionConfiguration
        let pathUntilNow = path


        let currentPrototypeDefinitions = {};
        if (configuration['__prototypes'] !== undefined) {
            currentPrototypeDefinitions = configuration['__prototypes'];
        }

        if(debug) console.log("currentPrototypeDefinitions", currentPrototypeDefinitions)

        if(debug) console.log("pathParts", pathParts)

        for (const pathPart of pathParts) {
            if (pathUntilNow === '') {
                pathUntilNow = pathPart;
            } else {
                pathUntilNow += '/' + pathPart;
            }

            if(debug) console.log("pathUntilNow", pathUntilNow)


            configuration = this.matchCurrentPathPart(pathPart, configuration, currentPrototypeDefinitions);
        }

        if(debug) console.groupEnd()

        return configuration
    }

    /**
     * Matches the current path segment and prepares the configuration.
     *
     * @param string pathPart
     * @param array previousConfiguration
     * @param array currentPrototypeDefinitions
     * @return array
     * @throws Exception
     */
    private matchCurrentPathPart(pathPart: string, previousConfiguration: { [key: string]: any }, currentPrototypeDefinitions: { [key: string]: any }): { [key: string]: any } {
        const debug = false
        
        if(debug) console.group("[RuntimeConfiguration] matchCurrentPathPart", pathPart)
        const matches = /^([^<]*)(<(.*?)>)?/.exec(pathPart)
        if (matches === null) {
            if(debug) console.groupEnd()
            throw new Error('Path Part ' + pathPart + ' not well-formed');
        }


        let currentPathSegment = matches[1];
        let configuration: { [key: string]: any } = {};

        if(debug) console.log("currentPathSegment", currentPathSegment)

        if (previousConfiguration[currentPathSegment] !== undefined) {
            configuration = previousConfiguration[currentPathSegment]
            if(debug) console.log("found path segment", configuration)
        }

        // if (configuration['__prototypes'] !== undefined) {
        //     currentPrototypeDefinitions = Object.assign(currentPrototypeDefinitions, configuration['__prototypes'])
        // }

        let currentPathSegmentType = null;
        if (configuration['__objectType'] !== undefined) {
            currentPathSegmentType = configuration['__objectType'];
        }
        if (matches[3] !== undefined) {
            currentPathSegmentType = matches[3];
            if(debug) console.log("RuntimeConfiguration currentPathSegmentType", currentPathSegmentType)
        }

        if (currentPathSegmentType !== null) {
            configuration['__objectType'] = currentPathSegmentType;
            configuration = this.mergePrototypesWithConfigurationForPathSegment(configuration, currentPrototypeDefinitions);
        }


        // here should there be an __meta.class in configuration.__meta

        if (typeof configuration === "object" && !isset(configuration['__value']) && !isset(configuration['__eelExpression']) &&  isset(configuration['__meta']?.['class']) &&  !isset(configuration['__objectType']) &&  !isset(configuration['__meta']?.['process'])) {
            configuration['__value'] = '';
        }

        // if(debug) console.log("would return configuration", configuration, pathPart)

        if(debug) console.groupEnd()

        return configuration;
    }

    mergePrototypesWithConfigurationForPathSegment(configuration: { [key: string]: any }, currentPrototypeDefinitions: { [key: string]: any }) {
        let currentPathSegmentType = configuration['__objectType'];
        const debug = false // currentPathSegmentType === "Neos.Fusion:Matcher"
        if(debug) console.log("\n")
        if(debug) console.log("[merge]currentPathSegmentType", currentPathSegmentType)
        if(debug) console.log("[merge]currentPrototypeDefinitions", currentPrototypeDefinitions)


        if (isset(currentPrototypeDefinitions[currentPathSegmentType])) {
            let prototypeMergingOrder = [currentPathSegmentType];
            if (currentPrototypeDefinitions[currentPathSegmentType]['__prototypeChain'] !== undefined) {

                prototypeMergingOrder = Object.assign(
                    currentPrototypeDefinitions[currentPathSegmentType]['__prototypeChain'],
                    prototypeMergingOrder
                );
            }

            if(debug) console.log("[merge]prototypeMergingOrder", prototypeMergingOrder)

            let currentPrototypeWithInheritanceTakenIntoAccount: any = {};

            for (const prototypeName of prototypeMergingOrder ) {
                if (!(prototypeName in currentPrototypeDefinitions)) {
                    throw new Error(`The Fusion object "${prototypeName}" which you tried to inherit from does not exist. Maybe you have a typo on the right hand side of your inheritance statement for "${currentPathSegmentType}".`)
                }

                currentPrototypeWithInheritanceTakenIntoAccount = Arrays.arrayMergeRecursiveOverruleWithCallback(
                    currentPrototypeWithInheritanceTakenIntoAccount,
                    currentPrototypeDefinitions[prototypeName],
                    this.simpleTypeToArrayClosure,
                    this.shouldOverrideFirstClosure
                );

                if(debug) console.log("[merge]currentPrototypeWithInheritanceTakenIntoAccount", currentPrototypeWithInheritanceTakenIntoAccount)

            }

            if(debug) console.log("[merge]configuration before", configuration)


            // We merge the already flattened prototype with the current configuration (in that order),
            // to make sure that the current configuration (not being defined in the prototype) wins.
            configuration = Arrays.arrayMergeRecursiveOverruleWithCallback(
                currentPrototypeWithInheritanceTakenIntoAccount,
                configuration,
                this.simpleTypeToArrayClosure,
                this.shouldOverrideFirstClosure
            );
            if(debug) console.log("[merge]configuration after", configuration)

            // If context-dependent prototypes are set (such as prototype("foo").prototype("baz")),
            // we update the current prototype definitions.
            if (currentPrototypeWithInheritanceTakenIntoAccount['__prototypes'] !== undefined) {
                currentPrototypeDefinitions = Arrays.arrayMergeRecursiveOverruleWithCallback(
                    currentPrototypeDefinitions,
                    currentPrototypeWithInheritanceTakenIntoAccount['__prototypes'],
                    this.simpleTypeToArrayClosure,
                    this.shouldOverrideFirstClosure
                );
            }

            if(debug) console.log("exiting...")
            if(debug) process.exit()
        }

        return configuration;
    }
}