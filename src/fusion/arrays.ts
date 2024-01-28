
const is_object = (thing: any) => typeof thing === 'object' && thing !== null && Array.isArray(thing)

export class Arrays {
    public static arrayMergeRecursiveOverrule(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, doNotAddNewKeys = false, emptyValuesOverride = true): { [key: string]: any } {
        const secondArraySanitized = secondArray ?? {}
        for (const [key, value] of Object.entries(secondArraySanitized)) {
            if (firstArray[key] !== undefined && firstArray[key] !== null && typeof firstArray[key] === "object") {
                firstArray[key] = this.arrayMergeRecursiveOverrule(firstArray[key], value, doNotAddNewKeys, emptyValuesOverride);
            } else if (!doNotAddNewKeys || Object.keys(firstArray).includes(key)) {
                firstArray[key] = emptyValuesOverride || !value || value.length > 0 ? value : firstArray[key];
            }
        }
        return firstArray;
    }

    /**
     * Merges two arrays recursively and "binary safe" (integer keys are overridden as well), overruling similar values in the first array ($firstArray) with the values of the second array ($secondArray)
     * In case of identical keys, ie. keeping the values of the second. The given $toArray closure will be used if one of the two array keys contains an array and the other not. It should return an array.
     *
     * @param array $firstArray First array
     * @param array $secondArray Second array, overruling the first array
     * @param \Closure $toArray The given callable will get a value that is not an array and has to return an array.
     *                          This is to allow custom merging of simple types with (sub) arrays
     * @param \Closure|null $overrideFirst The given callable will determine whether the value of the first array should be overridden.
     *                                     It should have the following signature $callable($key, ?array $firstValue = null, ?array $secondValue = null): bool
     * @return array Resulting array where $secondArray values has overruled $firstArray values
     */
    public static arrayMergeRecursiveOverruleWithCallback(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, toArray: (value: any) => { [key: string]: any }, overrideFirst?: (key: string, firstArray: { [key: string]: any }, secondArray: { [key: string]: any }) => boolean): { [key: string]: any } {
        // {[key: string]: any}
        let data = [firstArray, secondArray]
        let entryCount = 1

        for (let i = 0; i < entryCount; i++) {
            let firstArrayInner = data[i * 2]
            let secondArrayInner = data[i * 2 + 1]
            for (const key in secondArrayInner) {
                let value = secondArrayInner[key]
                if (!firstArrayInner[key] || (!is_object(firstArrayInner[key]) && !is_object(value))) {
                    firstArrayInner[key] = value
                } else {
                    if (!is_object(value)) value = toArray(value)
                    if (!is_object(firstArrayInner[key])) firstArrayInner[key] = toArray(firstArrayInner[key])

                    if (is_object(firstArrayInner[key]) && is_object(value)) {
                        if (overrideFirst?.(key, firstArrayInner[key], value)) firstArrayInner[key] = value

                        data.push(firstArrayInner[key])
                        data.push(value)
                        entryCount++
                    } else {
                        firstArrayInner[key] = value
                    }
                }
            }
        }
        return firstArray;
    }

    public static unsetValueByPath(arr: { [key: string]: any }, path: string | string[]): { [key: string]: any } {
        if (typeof path === "string") {
            path = path.split(".");
        } else if (!Array.isArray(path)) {
            throw new Error("unsetValueByPath() expects path to be string or array");
        }
        const [key, ...remainingPath] = path;
        if (!remainingPath.length) {
            delete arr[key];
        } else if (typeof arr[key] === "object") {
            arr[key] = this.unsetValueByPath(arr[key], remainingPath);
        }
        return arr;
    }


    public static getValueByPath(array: { [key: string]: any }, path: string | string[]): any {
        if (typeof path === "string") {
            path = path.split('.');
        } else if (typeof path !== "object") {
            throw new Error('getValueByPath() expects path to be string or array, "' + (typeof path) + '" given.')
            // throw new \InvalidArgumentException('getValueByPath() expects path to be string or array, "' . gettype(path) . '" given.', 1304950007);
        }
        const key = path.shift();
        if (key !== undefined && array[key] !== undefined) {
            if (path.length > 0) {
                return (typeof array[key] === "object") ? this.getValueByPath(array[key], path) : null;
            } else {
                return array[key];
            }
        } else {
            return null;
        }
    }

    public static mergeArraysRecursively(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, toArray: (value: any) => any, overrideFirst: ((key: string, firstValue: any, secondValue: any) => boolean) | null = null): { [key: string]: any } {
        const data = [firstArray, secondArray];
        let entryCount = 1;
        for (let i = 0; i < entryCount; i++) {
            const firstArrayInner = data[i * 2];
            const secondArrayInner = data[i * 2 + 1];

            for (const key in secondArrayInner) {
                let value = secondArrayInner[key];
                if (firstArrayInner[key] === undefined || typeof firstArrayInner[key] !== "object" || typeof value !== "object") {
                    firstArrayInner[key] = value;
                } else {
                    if (typeof value !== "object") value = toArray(value)

                    if (typeof firstArrayInner[key] !== "object") {
                        firstArrayInner[key] = toArray(firstArrayInner[key]);
                    }

                    if (typeof firstArrayInner[key] === "object" && typeof value === "object") {
                        if (overrideFirst?.(key, firstArrayInner[key], value)) {
                            firstArrayInner[key] = value;
                        } else {
                            data.push(firstArrayInner[key], value);
                            entryCount += 1;
                        }
                    } else {
                        firstArrayInner[key] = value;
                    }
                }
            }
        }
        return firstArray;
    }

}