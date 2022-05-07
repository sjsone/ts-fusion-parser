export class Arrays {
    /**
      * Merges two arrays recursively and "binary safe" (integer keys are overridden as well), overruling similar values
      * in the first array (firstArray) with the values of the second array (secondArray) in case of identical keys,
      * ie. keeping the values of the second.
      *
      * @param {array} firstArray First array
      * @param {array} secondArray Second array, overruling the first array
      * @param {boolean} dontAddNewKeys If set, keys that are NOT found in firstArray (first array) will not be set. Thus only existing value can/will be overruled from second array.
      * @param {boolean} emptyValuesOverride If set (which is the default), values from secondArray will overrule if they are empty (according to PHP's empty() function)
      * @return array Resulting array where secondArray values has overruled firstArray values
      */
    public static arrayMergeRecursiveOverrule(firstArray: {[key: string]: any}, secondArray: {[key: string]: any}, dontAddNewKeys: boolean = false, emptyValuesOverride: boolean = true) {
        const data = [firstArray, secondArray];
        let entryCount = 1;
        for (let i = 0; i < entryCount; i++) {
            const firstArrayInner = data[i * 2];
            const secondArrayInner = data[i * 2 + 1];
            for(const [key, value] of Object.entries(secondArrayInner)) {
                if (firstArrayInner[key] !== undefined && Array.isArray(firstArrayInner[key])) {
                    if ((!emptyValuesOverride || value !== []) && Array.isArray(value)) {
                        data.push(firstArrayInner[key])
                        data.push(value)
                        entryCount++;
                    } else {
                        firstArrayInner[key] = value;
                    }
                } else {
                    if (dontAddNewKeys) {
                        if (Object.keys(firstArrayInner).includes(key) && (emptyValuesOverride || !value)) {
                            firstArrayInner[key] = value;
                        }
                    } else {
                        if (emptyValuesOverride || !value) {
                            firstArrayInner[key] = value;
                        } else if(firstArrayInner[key] === undefined && value === []) {
                            firstArrayInner[key] = value;
                        }
                    }
                }
            }
        }
        // reset(firstArray);
        return firstArray;
    }

    public static unsetValueByPath(arr: any[], path: any)
    {
        if (typeof path === "string") {
            path = path.split('.')
        } else if (!Array.isArray(path)) {
            throw new Error("unsetValueByPath() expects path to be string or array")
            // throw new \InvalidArgumentException('unsetValueByPath() expects path to be string or array, "' . gettype(path) . '" given.', 1305111513);
        }
        const key = path.shift()
        if (path.length === 0) {
            delete arr[key]
        } else {
            if (arr[key] === undefined || !Array.isArray(arr[key])) {
                return arr;
            }
            arr[key] = self::unsetValueByPath(arr[key], path);
        }
        return arr;
    }

}