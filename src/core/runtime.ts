import { EelUtility } from "../eel/eelUtility";
import { AbstractArrayFusionObject } from "../fusionObjects/abstractArrayFusionObject";
import { AbstractFusionObject } from "../fusionObjects/abstractFusionObject";
import { FusionObjectManager } from "../fusionObjects/fusionObjectManager";
import { Arrays } from "./arrays";
import { ControllerContext } from "./controllerContext";
import { Parser } from "./parser";
import { RuntimeConfiguration } from "./runtimeConfiguration";

export class Runtime
{
    
    // /**
    //  * Stack of evaluated "@context" values
    //  *
    //  * @var array
    //  */
    protected contextStack: any[] = [];

    // /**
    //  * Reference to the current context
    //  *
    //  * @var array
    //  */
    protected currentContext: {[key: string]: any} = {};

    // /**
    //  * Reference to the current apply value
    //  *
    //  * @var array
    //  */
    protected currentApplyValues: {[key: string]: any} = {};

    // /**
    //  * Default context with helper definitions
    //  *
    //  * @var array
    //  */
    protected defaultContextVariables: {[key: string]: any} = {};

    // /**
    //  * @var array
    //  */
    protected runtimeConfiguration;

    /**
     * @var array
     */
    protected settings: {[key: string]: any};

    // /**
    //  * @var boolean
    //  */
    // protected debugMode = false;

    // /**
    //  * @var string
    //  */
    protected lastEvaluationStatus = '';

    // /**
    //  * Constructor for the Fusion Runtime
    //  *
    //  * @param array fusionConfiguration
    //  * @param ControllerContext controllerContext
    //  */
    constructor(fusionConfiguration: {[key: string]: any}, controllerContext: ControllerContext)
    {
        this.settings = {}
        this.runtimeConfiguration = new RuntimeConfiguration(fusionConfiguration);

    }

    // /**
    //  * Inject settings of this package
    //  *
    //  * @param array settings The settings
    //  * @return void
    //  */
    // public injectSettings(array settings)
    // {
    //     this.settings = settings;
    //     if (isset(this.settings['debugMode'])) {
    //         this.setDebugMode(this.settings['debugMode'] === true);
    //     }
    //     if (isset(this.settings['enableContentCache'])) {
    //         this.setEnableContentCache(this.settings['enableContentCache'] === true);
    //     }
    // }

    // /**
    //  * Add a tag to the current cache segment
    //  *
    //  * During Fusion rendering the method can be used to add tag dynamicaly for the current cache segment.
    //  *
    //  * @param string key
    //  * @param string value
    //  * @return void
    //  * @api
    //  */
    // public addCacheTag(key, value)
    // {
    //     if (this.runtimeContentCache.getEnableContentCache() === false) {
    //         return;
    //     }
    //     this.runtimeContentCache.addTag(key, value);
    // }

    /**
     * Completely replace the context array with the new contextArray.
     *
     * Purely internal method, should not be called outside of Neos.Fusion.
     *
     * @param array contextArray
     * @return void
     */
    public pushContextArray(contextArray: any)
    {
        this.contextStack.push(contextArray);
        this.currentContext = contextArray;
    }

    /**
     * Push a new context object to the rendering stack
     *
     * @param string key the key inside the context
     * @param mixed context
     * @return void
     */
    public pushContext(key: string, context: any)
    {
        const newContext = this.currentContext;
        newContext[key] = context;
        this.contextStack.push(newContext);
        this.currentContext = newContext;
    }

    /**
     * Remove the topmost context objects and return them
     *
     * @return array the topmost context objects as associative array
     */
    public popContext()
    {
        const lastItem = this.contextStack.pop()
        this.currentContext = this.contextStack.length === 0 ? [] : this.contextStack[this.contextStack.length - 1];
        return lastItem;
    }

    /**
     * Get the current context array
     *
     * @return array the array of current context objects
     */
    public getCurrentContext()
    {
        return this.currentContext;
    }

    public popApplyValues(paths: any[]): void
    {
        for (const path of paths) {
            delete this.currentApplyValues[path]
        }
    }

    /**
     * @return string
     */
    public getLastEvaluationStatus()
    {
        return this.lastEvaluationStatus;
    }

    /**
     * Render an absolute Fusion path and return the result.
     *
     * Compared to this.evaluate, this adds some more comments helpful for debugging.
     *
     * @param string fusionPath
     * @return mixed
     * @throws \Exception
     * @throws SecurityException
     */
    public render(fusionPath: string)
    {
        // try {
            
        // } catch (SecurityException securityException) {
        //     throw securityException;
        // } catch (\Exception exception) {
        //     output = this.handleRenderingException(fusionPath, exception);
        // }

        let output = this.evaluate(fusionPath, null);
        // if (this.debugMode) {
        //     output = sprintf(
        //         '%1s<!-- Beginning to render Fusion path "%2s" (Context: %3s) -.%4s%1s<!-- End to render Fusion path "%2s" (Context: %3s) -.',
        //         chr(10),
        //         fusionPath,
        //         implode(', ', array_keys(this.currentContext)),
        //         output
        //     );
        // }

        return output;
    }

    /**
     * Handle an Exception thrown while rendering Fusion according to
     * settings specified in Neos.Fusion.rendering.exceptionHandler
     *
     * @param string fusionPath
     * @param \Exception exception
     * @param boolean useInnerExceptionHandler
     * @return string
     * @throws Exception
     * @throws InvalidConfigurationException
     * @throws SecurityException
     * @throws StopActionException
     */
    public handleRenderingException(fusionPath: string, exception: Error, useInnerExceptionHandler = false)
    {
        return `${'#'.repeat(10)} \n [${exception.name}]:  ${exception.message} \n\n`
    }

    /**
     * Determine if the given Fusion path is renderable, which means it exists
     * and has an implementation.
     *
     * @param string fusionPath
     * @return boolean
     * @throws Exception
     */
    public canRender(fusionPath: string)
    {
        let fusionConfiguration = this.runtimeConfiguration.forPath(fusionPath);

        if (fusionConfiguration['__eelExpression'] !== undefined || fusionConfiguration['__value'] !== undefined) {
            return true;
        }

        if (fusionConfiguration['__meta']['class'] !== undefined && fusionConfiguration['__objectType'] !== undefined) {
            return true;
        }

        return false;
    }

    // /**
    //  * Evaluate an absolute Fusion path and return the result
    //  *
    //  * @param string fusionPath
    //  * @param mixed contextObject The object which will be "this" in Eel expressions. ONLY FOR INTERNAL USE!
    //  * @param string behaviorIfPathNotFound One of BEHAVIOR_EXCEPTION or BEHAVIOR_RETURNNULL
    //  * @return mixed
    //  *
    //  * @throws StopActionException
    //  * @throws SecurityException
    //  * @throws Exception
    //  * @throws RuntimeException
    //  * @throws InvalidConfigurationException
    //  */
    public evaluate( fusionPath: string, contextObject: AbstractFusionObject|null = null): any
    {
        const debug = fusionPath === "root<Neos.Fusion:Case>/otherCondition<Neos.Fusion:Matcher>/condition"
        if(debug) console.log(`[evaluate] fusionPath ${fusionPath}`)

        let needToPopContext = false;
        let needToPopApply = false;

        let fusionConfiguration = this.runtimeConfiguration.forPath(fusionPath);


        // Check if the current "@apply" contain an entry for the requested fusionPath
        // in which case this value is returned after applying @if and @process rules
        if (this.currentApplyValues[fusionPath] !== undefined) {
            if(debug) console.log(`[evaluate] Found apply values`)
            if (fusionConfiguration['__meta']['if'] !== undefined && this.evaluateIfCondition(fusionConfiguration, fusionPath, contextObject) === false) {
                return null;
            }
            let appliedValue = this.currentApplyValues[fusionPath]['value'];
            if (this.currentApplyValues[fusionPath]['lazy'] !== undefined) {
                appliedValue = appliedValue();
            }
            if (fusionConfiguration['__meta']['process'] !== undefined) {
                appliedValue = this.evaluateProcessors(appliedValue, fusionConfiguration, fusionPath, contextObject);
            }
            return appliedValue;
        }

        // Fast path for expression or value
        try {
            const isEelExpression = fusionConfiguration['__eelExpression'] !== null && fusionConfiguration['__eelExpression'] !== undefined
            const isValue = fusionConfiguration['__value'] !== null && fusionConfiguration['__value'] !== undefined
            
            if (isEelExpression || isValue) {
                if(debug) console.log("[evaluate] fast path for expression or value", fusionConfiguration['__eelExpression'], fusionConfiguration['__value'])

                return this.evaluateExpressionOrValueInternal(fusionPath, fusionConfiguration, <AbstractArrayFusionObject>contextObject);
            }
        } catch (stopActionException) {
            throw stopActionException;
        }
        // } catch (SecurityException securityException) {
        //     throw securityException;
        // } catch (RuntimeException runtimeException) {
        //     throw runtimeException;
        // } catch (\Exception exception) {
        //     return this.handleRenderingException(fusionPath, exception, true);
        // }

        const cacheContext = {
            'configuration': fusionConfiguration,
            'fusionPath': fusionPath,
            'cacheForPathEnabled': false,
            'cacheForPathDisabled': true,
            'currentPathIsEntryPoint': true
        }
        //  if (!(isset($fusionConfiguration['__meta']['class']) && isset($fusionConfiguration['__objectType'])))
        if (!(fusionConfiguration['__meta']?.['class'] !== undefined && fusionConfiguration['__objectType'] !== null)) {
            this.finalizePathEvaluation(cacheContext);
            if(debug) console.log("[evaluate] fusionConfiguration return null for ", fusionConfiguration, {
                __objectType: fusionConfiguration['__objectType']
            })
            // this.throwExceptionForUnrenderablePathIfNeeded(fusionPath, fusionConfiguration, behaviorIfPathNotFound);
            return null;
        }

        let applyPathsToPop: any[] = [];
        let output
        try {
            applyPathsToPop = this.prepareApplyValuesForFusionPath(fusionPath, fusionConfiguration);
            let fusionObject = this.instantiateFusionObject(fusionPath, fusionConfiguration, applyPathsToPop);
            if(debug) console.log("[evaluate] got fusion object", fusionObject.constructor.name)
            // if(debug) console.log("[evaluate] will prepare context with path", fusionPath)
            needToPopContext = this.prepareContextForFusionObject(fusionObject, fusionPath, fusionConfiguration, cacheContext);
            output = this.evaluateObjectOrRetrieveFromCache(fusionObject, fusionPath, fusionConfiguration, cacheContext);
        } catch ( stopActionException) {
            this.finalizePathEvaluation(cacheContext, needToPopContext, applyPathsToPop);
            throw stopActionException;
        }
        // } catch (SecurityException securityException) {
        //     this.finalizePathEvaluation(cacheContext, needToPopContext, applyPathsToPop);
        //     throw securityException;
        // } catch (RuntimeException runtimeException) {
        //     this.finalizePathEvaluation(cacheContext, needToPopContext, applyPathsToPop);
        //     throw runtimeException;
        // } catch (\Exception exception) {
        //     this.finalizePathEvaluation(cacheContext, needToPopContext, applyPathsToPop);
        //     return this.handleRenderingException(fusionPath, exception, true);
        // }

        this.finalizePathEvaluation(cacheContext, needToPopContext, applyPathsToPop);

        if(debug) console.log("[evaluate] output", output)

        return output;
    }

    /**
     * Does the evaluation of a Fusion instance, first checking the cache and if conditions and afterwards applying processors.
     *
     * @param AbstractFusionObject fusionObject
     * @param string fusionPath
     * @param array fusionConfiguration
     * @param array cacheContext
     * @return mixed
     */
    protected evaluateObjectOrRetrieveFromCache(fusionObject: AbstractFusionObject, fusionPath: string, fusionConfiguration: {[key: string]: any}, cacheContext: any)
    {
        let output = null;
        // [cacheHit, cachedResult] = this.runtimeContentCache.preEvaluate(cacheContext, fusionObject);
        // if (cacheHit) {
        //     return cachedResult;
        // }

        let evaluateObject = true;
        if (fusionConfiguration['__meta']['if'] !== undefined && this.evaluateIfCondition(fusionConfiguration, fusionPath, fusionObject) === false) {
            evaluateObject = false;
        }

        console.log("[evaluateObjectOrRetrieveFromCache] evaluateObject", evaluateObject)

        if (evaluateObject) {
            output = fusionObject.evaluate();
        }

        if (evaluateObject && fusionConfiguration['__meta']['process'] !== undefined) {
            output = this.evaluateProcessors(output, fusionConfiguration, fusionPath, fusionObject);
        }
        // output = this.runtimeContentCache.postProcess(cacheContext, fusionObject, output);
        return output;
    }

    // /**
    //  * Evaluates an EEL expression or value, checking if conditions first and applying processors.
    //  *
    //  * @param string fusionPath the Fusion path up to now
    //  * @param array fusionConfiguration Fusion configuration for the expression or value
    //  * @param \Neos\Fusion\FusionObjects\AbstractFusionObject contextObject An optional object for the "this" value inside the context
    //  * @return mixed The result of the evaluation
    //  * @throws Exception
    //  */
    protected evaluateExpressionOrValueInternal(fusionPath: string, fusionConfiguration: any, contextObject: AbstractFusionObject)
    {
        if (fusionConfiguration['__meta']?.['if'] !== undefined && this.evaluateIfCondition(fusionConfiguration, fusionPath, contextObject) === false) {
            return null;
        }

        let evaluatedValue
        if (fusionConfiguration['__eelExpression'] !== null && fusionConfiguration['__eelExpression'] !== undefined) {
            try {
                evaluatedValue = this.evaluateEelExpression(fusionConfiguration['__eelExpression'], contextObject);

            } catch(error) {
                console.log("ERROR: evaluateExpressionOrValueInternal", fusionPath, fusionConfiguration)
                throw error
            }
        } else {
            // must be simple type, as this is the only place where this method is called.
            evaluatedValue = fusionConfiguration['__value'];
        }

        if (fusionConfiguration['__meta'] !== undefined && fusionConfiguration['__meta']['process'] !== null && fusionConfiguration['__meta']['process'] !== undefined) {
            evaluatedValue = this.evaluateProcessors(evaluatedValue, fusionConfiguration, fusionPath, contextObject);
        }

        return evaluatedValue;
    }

    /**
     * Possibly prepares a new "@apply" context for the current fusionPath and pushes it to the stack.
     * Returns true to express that new properties were pushed and have to be popped during finalizePathEvaluation.
     *
     * Since "@apply" are not inherited every call of this method leads to a completely new  "@apply"
     * context, which is null by default.
     *
     * @param string fusionPath
     * @param array fusionConfiguration
     * @return array Paths to pop
     * @throws Exception
     * @throws RuntimeException
     * @throws SecurityException
     * @throws StopActionException
     */
    protected prepareApplyValuesForFusionPath(fusionPath: string, fusionConfiguration: {[key: string]: any}): []
    {
        return []
        // let spreadValues = this.evaluateApplyValues(fusionConfiguration, fusionPath);
        // if (spreadValues === null) {
        //     return [];
        // }

        // for(const path in spreadValues) {
        //     const entry = spreadValues[path]
        //     this.currentApplyValues[path] = entry
        // }
        // return Object.keys(spreadValues);
    }

    /**
     * Possibly prepares a new context for the current FusionObject and cache context and pushes it to the stack.
     * Returns if a new context was pushed to the stack or not.
     *
     * @param AbstractFusionObject fusionObject
     * @param string fusionPath
     * @param array fusionConfiguration
     * @param array cacheContext
     * @return boolean
     * @throws Exception
     * @throws RuntimeException
     * @throws SecurityException
     * @throws StopActionException
     */
    protected prepareContextForFusionObject(fusionObject: AbstractFusionObject, fusionPath: string, fusionConfiguration: {[key: string]: any}, cacheContext: any)
    {
        const debug = fusionPath === "root<Neos.Fusion:Case>/otherCondition<Neos.Fusion:Matcher>/condition"
        let newContextArray: any
        if (cacheContext['cacheForPathDisabled'] === true) {
            newContextArray = [];

            for(const contextVariableName in cacheContext['configuration']['context']) {
                if (this.currentContext[contextVariableName] !== undefined) {
                    newContextArray[contextVariableName] = this.currentContext[contextVariableName];
                }
            }
        }

        if (fusionConfiguration['__meta']['context'] !== undefined) {
            newContextArray = newContextArray !== undefined ? newContextArray : this.currentContext;

            for(const contextKey in fusionConfiguration['__meta']['context']) {
                const contextValue = fusionConfiguration['__meta']['context'][contextKey]
                newContextArray[contextKey] = this.evaluate(fusionPath + '/__meta/context/' + contextKey, fusionObject);
            }
        }

        if (newContextArray !== undefined) {
            this.pushContextArray(newContextArray);
            return true;
        }

        return false;
    }

    /**
     * Ends the evaluation of a fusion path by popping the context and property stack if needed and leaving the cache context.
     *
     * @param array cacheContext
     * @param boolean needToPopContext
     * @param array applyPathsToPop
     * @return void
     */
    protected finalizePathEvaluation(cacheContext: {[key: string]: any}, needToPopContext = false, applyPathsToPop: any[] = [])
    {
        if (needToPopContext) {
            this.popContext();
        }

        if (applyPathsToPop !== []) {
            this.popApplyValues(applyPathsToPop);
        }

        // this.runtimeContentCache.leave(cacheContext);
    }

    /**
     * Instantiates a Fusion object specified by the given path and configuration
     *
     * @param string fusionPath Path to the configuration for this object instance
     * @param array fusionConfiguration Configuration at the given path
     * @param array applyValuePaths Apply value paths for this object
     * @return AbstractFusionObject
     * @throws Exception
     */
    protected instantiateFusionObject(fusionPath: string, fusionConfiguration: {[key: string]: any}, applyValuePaths: any[] )
    {
        let fusionObjectType = fusionConfiguration['__objectType'];

        let fusionObjectClassName = fusionConfiguration['__meta']['class'] !== undefined ? fusionConfiguration['__meta']['class'].__value : null;

        
        if (!/<[^>]*>/.test(fusionPath)) {
            // Only add Fusion object type to last path part if not already set
            fusionPath += '<' + fusionObjectType + '>';
        }
        if (!FusionObjectManager.has(fusionObjectClassName)) {
            throw new Error(`The implementation class "${fusionObjectClassName}" defined for Fusion object of type "${fusionObjectType}" does not exist. Maybe a typo in the "@class" property.`);
        }

        const fusionObjectClass = FusionObjectManager.get(fusionObjectClassName)

        /** @type {AbstractFusionObject} fusionObject */
        let fusionObject = <AbstractFusionObject> new (<any>fusionObjectClass)(this, fusionPath, fusionObjectType);
        if (fusionObject instanceof AbstractArrayFusionObject) {
            /** @var fusionObject AbstractArrayFusionObject */
            if (fusionConfiguration['__meta']['ignoreProperties'] !== undefined) {
                let evaluatedIgnores = this.evaluate(fusionPath + '/__meta/ignoreProperties', fusionObject);
                fusionObject.setIgnoreProperties(typeof evaluatedIgnores === "object" ? evaluatedIgnores : []);
            }
            this.setPropertiesOnFusionObject(fusionObject, fusionConfiguration, applyValuePaths);
        }
        return fusionObject;
    }

    /**
     * Check if the given object is an array like object that should get all properties set to iterate or process internally.
     *
     * @param AbstractFusionObject fusionObject
     * @return boolean
     */
    protected isArrayFusionObject(fusionObject: AbstractFusionObject)
    {
        return (fusionObject instanceof AbstractArrayFusionObject);
    }

    /**
     * Set options on the given (AbstractArray)Fusion object
     *
     * @param AbstractArrayFusionObject fusionObject
     * @param array fusionConfiguration
     * @param array applyValuePaths
     * @return void
     */
    protected setPropertiesOnFusionObject(fusionObject: AbstractArrayFusionObject, fusionConfiguration: {[key: string]: any}, applyValuePaths: any[])
    {
        for(const key in fusionConfiguration) {
            const value = fusionConfiguration[key]
            // skip keys which start with __, as they are purely internal.
            if (typeof key === "string" && key.startsWith('__') && Parser.reservedParseTreeKeys.includes(key)) {
                continue;
            }
            (<any>fusionObject).properties[key] = value
        }


        if (applyValuePaths !== []) {
            for(const path of applyValuePaths) {
                let entry = this.currentApplyValues[path];
                let key = entry['key'];
                let valueAst: any
                if (entry['lazy'] !== undefined) {
                    valueAst = {
                        '__eelExpression': null,
                        // Mark this property as not having a simple value in the AST -
                        // the object implementation has to evaluate the key through the Runtime
                        '__objectType': 'Neos.Fusion:Lazy',
                        '__value': null
                    }
                } else {
                    valueAst = {
                        '__eelExpression': null,
                        '__objectType': null,
                        '__value': entry['value']
                    }
                }

                // merge existing meta-configuration to valueAst
                // to preserve @if, @process and @position informations
                let meta = Arrays.getValueByPath(fusionConfiguration, [key, '__meta'])
                if (meta) {
                    valueAst['__meta'] = meta;
                }
                
                (<any>fusionObject).properties[entry['key']]  = valueAst
            }
        }
    }

    /**
     * Get variables from configuration that should be set in the context by default.
     * For example Eel helpers are made available by this.
     *
     * @return array Array with default context variable objects.
     */
     protected getDefaultContextVariables()
     {
         if (this.defaultContextVariables === null || this.defaultContextVariables === undefined ) {
            this.defaultContextVariables = {};
            if (this.settings['defaultContext'] !== undefined && typeof this.settings['defaultContext'] === "object") {
            // this.defaultContextVariables = EelUtility::getDefaultContextVariables(this.settings['defaultContext']);
            }
            // this.defaultContextVariables['request'] = this.controllerContext->getRequest();
         }
         return this.defaultContextVariables;
     }

    /**
     * Evaluate an Eel expression
     *
     * @param string expression The Eel expression to evaluate
     * @param \Neos\Fusion\FusionObjects\AbstractFusionObject contextObject An optional object for the "this" value inside the context
     * @return mixed The result of the evaluated Eel expression
     * @throws Exception
     */
    protected evaluateEelExpression(expression: string, contextObject: AbstractFusionObject|null = null)
    {

        console.log("[Runtime]::evaluateEelExpression", expression)

        if (expression[0] !== '' || expression[1] !== '{') {
            // We still assume this is an EEL expression and wrap the markers for backwards compatibility.
            expression = '{' + expression + '}';
        }



        let contextVariables = Object.assign(this.getDefaultContextVariables(), this.currentContext);

        if (contextVariables['this'] !== undefined) {
            // console.log("this", this.getDefaultContextVariables(), this.currentContext)
            // throw new Error('Context variable "this" not allowed, as it is already reserved for a pointer to the current Fusion object.')
            // throw new Exception('Context variable "this" not allowed, as it is already reserved for a pointer to the current Fusion object.', 1344325044);
        }
        contextVariables['this'] = contextObject;

        return EelUtility.evaluateEelExpression(expression, /*this.eelEvaluator*/ undefined, contextVariables);
    }

    // /**
    //  * Evaluate "@apply" for the given fusion key.
    //  *
    //  * If apply-definitions are found they are evaluated and the returned keys are combined.
    //  * The result is returned as array with the following structure:
    //  *
    //  * [
    //  *    'fusionPath/key_1' => ['key' => 'key_1', 'value' => 'evaluated value 1'],
    //  *    'fusionPath/key_2' => ['key' => 'key_2', 'value' => 'evaluated value 2']
    //  * ]
    //  *
    //  * If no apply-expression is defined null is returned instead.
    //  *
    //  * @param array configurationWithEventualProperties
    //  * @param string fusionPath
    //  * @return array|null
    //  */
    // protected evaluateApplyValues(configurationWithEventualProperties, fusionPath): ?array
    // {
    //     if (isset(configurationWithEventualProperties['__meta']['apply'])) {
    //         fusionObjectType = configurationWithEventualProperties['__objectType'];
    //         if (!preg_match('#<[^>]*>#', fusionPath)) {
    //             // Only add Fusion object type to last path part if not already set
    //             fusionPath .= '<' . fusionObjectType . '>';
    //         }
    //         combinedApplyValues = [];
    //         propertiesConfiguration = configurationWithEventualProperties['__meta']['apply'];
    //         positionalArraySorter = new PositionalArraySorter(propertiesConfiguration, '__meta.position');
    //         foreach (positionalArraySorter.getSortedKeys() as key) {
    //             // skip keys which start with __, as they are purely internal.
    //             if (key[0] === '_' && key[1] === '_' && in_array(key, Parser.reservedParseTreeKeys, true)) {
    //                 continue;
    //             }

    //             singleApplyPath = fusionPath . '/__meta/apply/' . key;
    //             if (isset(propertiesConfiguration[key]['__meta']['if']) && this.evaluateIfCondition(propertiesConfiguration[key], singleApplyPath) === false) {
    //                 continue;
    //             }
    //             if (isset(propertiesConfiguration[key]['expression'])) {
    //                 singleApplyPath .= '/expression';
    //             }
    //             singleApplyValues = this.evaluate(singleApplyPath, null, Runtime.BEHAVIOR_EXCEPTION);
    //             if (this.getLastEvaluationStatus() !== static.EVALUATION_SKIPPED) {
    //                 if (singleApplyValues === null) {
    //                     continue;
    //                 } elseif (is_array(singleApplyValues)) {
    //                     foreach (singleApplyValues as key => value) {
    //                         // skip keys which start with __, as they are purely internal.
    //                         if (key[0] === '_' && key[1] === '_' && in_array(key, Parser.reservedParseTreeKeys, true)) {
    //                             continue;
    //                         }

    //                         combinedApplyValues[fusionPath . '/' . key] = [
    //                             'key' => key,
    //                             'value' => value
    //                         ];
    //                     }
    //                 } elseif (singleApplyValues instanceof \Traversable && singleApplyValues instanceof \ArrayAccess) {
    //                     for (singleApplyValues.rewind(); (key = singleApplyValues.key()) !== null; singleApplyValues.next()) {
    //                         combinedApplyValues[fusionPath . '/' . key] = [
    //                             'key' => key,
    //                             'value' => function () use (singleApplyValues, key) {
    //                                 return singleApplyValues[key];
    //                             },
    //                             'lazy' => true
    //                         ];
    //                     }
    //                 }
    //             }
    //         }
    //         return combinedApplyValues;
    //     }

    //     return null;
    // }

    /**
     * Evaluate processors on given value.
     *
     * @param mixed valueToProcess
     * @param array configurationWithEventualProcessors
     * @param string fusionPath
     * @param AbstractFusionObject contextObject
     * @return mixed
     */
    protected evaluateProcessors(valueToProcess: any, configurationWithEventualProcessors: any, fusionPath: string,  contextObject: AbstractFusionObject|null = null)
    {
        let processorConfiguration = configurationWithEventualProcessors['__meta']['process'];
        console.log("processorConfiguration", processorConfiguration)
        // let positionalArraySorter = new PositionalArraySorter(processorConfiguration, '__meta.position');
        // for (const key of positionalArraySorter.getSortedKeys()) {

        for (const key of Object.keys(processorConfiguration)) {
            let processorPath = fusionPath + '/__meta/process/' + key;
            if (processorConfiguration[key]['__meta']['if'] !== undefined && this.evaluateIfCondition(processorConfiguration[key], processorPath, contextObject) === false) {
                continue;
            }

            //  If there is only the internal "__stopInheritanceChain" path set, skip evaluation
            if (processorConfiguration[key].length === 1 && processorConfiguration[key]['__stopInheritanceChain'] !== undefined) {
                continue;
            }

            if (processorConfiguration[key]['expression'] !== undefined) {
                processorPath += '/expression';
            }

            this.pushContext('value', valueToProcess);
            let result = this.evaluate(processorPath, contextObject);
            // if (this.getLastEvaluationStatus() !== Runtime.EVALUATION_SKIPPED) {
            if(true) {
                valueToProcess = result;
            }
            this.popContext();
        }

        return valueToProcess;
    }

    /**
     * Evaluate eventually existing meta "@if" conditionals inside the given configuration and path.
     *
     * @param array configurationWithEventualIf
     * @param string configurationPath
     * @param AbstractFusionObject contextObject
     * @return boolean
     */
    protected evaluateIfCondition(configurationWithEventualIf: any, configurationPath: string,  contextObject: AbstractFusionObject|null = null)
    {
        for(const conditionKey in configurationWithEventualIf['__meta']['if']) {
            let conditionValue = configurationWithEventualIf['__meta']['if'][conditionKey]
            conditionValue = this.evaluate(configurationPath + '/__meta/if/' + conditionKey, contextObject);
            if (Boolean(conditionValue) === false) {
                return false;
            }
        }


        return true;
    }

    // /**
    //  * Get variables from configuration that should be set in the context by default.
    //  * For example Eel helpers are made available by this.
    //  *
    //  * @return array Array with default context variable objects.
    //  */
    // protected getDefaultContextVariables()
    // {
    //     if (this.defaultContextVariables === null) {
    //         this.defaultContextVariables = [];
    //         if (isset(this.settings['defaultContext']) && is_array(this.settings['defaultContext'])) {
    //             this.defaultContextVariables = EelUtility.getDefaultContextVariables(this.settings['defaultContext']);
    //         }
    //         this.defaultContextVariables['request'] = this.controllerContext.getRequest();
    //     }
    //     return this.defaultContextVariables;
    // }


    // /**
    //  * @param boolean debugMode
    //  * @return void
    //  */
    // public setDebugMode(debugMode)
    // {
    //     this.debugMode = debugMode;
    // }

    // /**
    //  * @return boolean
    //  */
    // public isDebugMode()
    // {
    //     return this.debugMode;
    // }

    // /**
    //  * If the Fusion content cache should be enabled at all
    //  *
    //  * @param boolean flag
    //  * @return void
    //  */
    // public setEnableContentCache(flag)
    // {
    //     this.runtimeContentCache.setEnableContentCache(flag);
    // }
}
