import { count } from "console";
import path from "path";
import { Runtime } from "../core/runtime";
import { AbstractFusionObject } from "./abstractFusionObject";

export abstract class AbstractArrayFusionObject extends AbstractFusionObject
{
    /**
     * List of properties which have been set using array access. We store this for *every* Fusion object
     * in order to do things like:
     * x = Foo {
     *   a = 'foo'
     *   b = {this.a + 'bar'}
     * }
     *
     * @var array
     * @internal
     */
    protected properties: {[key: string]: any} = {};

    /**
     * If you iterate over "properties" these in here should usually be ignored. For example additional properties in "Case" that are not "Matchers".
     *
     * @var array
     */
    protected ignoreProperties: {[key: string]: any} = {};

    /**
     * @param array ignoreProperties
     * @return void
     */
    public setIgnoreProperties(ignoreProperties = {})
    {
        this.ignoreProperties = ignoreProperties;
    }

    /**
     * @param any offset
     * @return boolean
     */
    public offsetExists(offset: string): boolean
    {
        return this.properties[offset] !== undefined;
    }

    /**
     * @param any offset
     * @return any
     */
    public offsetGet(offset: string): any
    {
        return this.fusionValue(offset);
    }

    /**
     * @param any offset
     * @param any value
     * @return void
     */
    public offsetSet(offset: string, value: any): void
    {
        this.properties[offset] = value;
    }

    /**
     * @param any offset
     * @return void
     */
    public offsetUnset(offset: string): void
    {
        delete this.properties[offset]
    }

    /**
     * @param string|null defaultFusionPrototypeName
     * @return array
     * @throws FusionException
     * @throws \Neos\Flow\Configuration\Exception\InvalidConfigurationException
     * @throws \Neos\Flow\Mvc\Exception\StopActionException
     * @throws \Neos\Flow\Security\Exception
     */
    protected evaluateNestedProperties(defaultFusionPrototypeName: string|null = null): {[key: string]: any}
    {
        const sortedChildFusionKeys = this.sortNestedProperties();

        if (sortedChildFusionKeys.length === 0) {
            return {};
        }

        let result: {[key: string]: any} = {};
        for(const key of sortedChildFusionKeys) {
            let propertyPath = key;
            if (defaultFusionPrototypeName !== null && this.isUntyped(key)) {
                propertyPath += '<' + defaultFusionPrototypeName + '>';
            }
            let value
            try {
                value = this.fusionValue(propertyPath);
            } catch (e) {
                value = this.runtime.handleRenderingException(this.path + '/' + key, <Error>e);
            }
            if (value === null && this.runtime.getLastEvaluationStatus() === Runtime.EVALUATION_SKIPPED) {
                continue;
            }
            result[key] = value;
        }

        return result;
    }

    /**
     * Sort the Fusion objects inside this.properties depending on:
     * - numerical ordering
     * - position meta-property
     *
     * This will ignore all properties defined in "@ignoreProperties" in Fusion
     *
     * @see PositionalArraySorter
     *
     * @return array an ordered list of key value pairs
     * @throws FusionException if the positional string has an unsupported format
     */
    protected sortNestedProperties(): Array<any>
    {
        // const arraySorter = new PositionalArraySorter(this.properties, '__meta.position');
        // let sortedFusionKeys
        // try {
        //     sortedFusionKeys = arraySorter.getSortedKeys();
        // } catch ( error) {
        //     console.error(error)
        //     throw new Error('Invalid position string')
        //     // throw new FusionException('Invalid position string', 1345126502, exception);
        // }

        // for(const ignoredPropertyName of this.ignoreProperties) {
        //     const key = array_search(ignoredPropertyName, sortedFusionKeys);
        //     if (key !== false) {
        //         unset(sortedFusionKeys[key]);
        //     }
        // }
        // return sortedFusionKeys;
        return Object.keys(this.properties)
    }

    /**
     * Returns TRUE if the given fusion key has no type, meaning neither
     * having a fusion objectType, eelExpression or value
     *
     * @param string|int key fusion child key path to check
     * @return boolean
     */
    protected isUntyped(key: string|number ): boolean
    {
        const property = <{[key: string]: any}>this.properties[key];
        if (typeof property === "object") {
            return false;
        }
        return property['__objectType'] === undefined && property['__eelExpression'] === undefined && property['__value'] === undefined
    }
}
