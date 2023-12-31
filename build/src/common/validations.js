"use strict";
/**
 * Copyright 2018, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDuplicateKeys = exports.validateMapElementNotNull = exports.validateArrayElementsNotNull = exports.validateNotNull = void 0;
/**
 * Validates that an object reference passed as a parameter to the calling
 * method is not null.
 *
 * @param reference An object reference.
 * @param errorMessage The exception message to use if the check fails.
 * @returns An object reference.
 */
function validateNotNull(reference, errorMessage) {
    if (reference === null || reference === undefined) {
        throw new Error(`Missing mandatory ${errorMessage} parameter`);
    }
    return reference;
}
exports.validateNotNull = validateNotNull;
/**
 * Validates that an array passed as a parameter doesn't contain null element.
 *
 * @param list The argument list to check for null.
 * @param errorMessage The exception message to use if the check fails.
 */
function validateArrayElementsNotNull(array, errorMessage) {
    const areAllDefined = array.every(element => element !== null && typeof element !== 'undefined');
    if (!areAllDefined) {
        throw new Error(`${errorMessage} elements should not be a NULL`);
    }
}
exports.validateArrayElementsNotNull = validateArrayElementsNotNull;
/** Throws an error if any of the map elements is null. */
function validateMapElementNotNull(map, errorMessage) {
    for (const [key, value] of map.entries()) {
        if (key == null || value == null) {
            throw new Error(`${errorMessage} elements should not be a NULL`);
        }
    }
}
exports.validateMapElementNotNull = validateMapElementNotNull;
/** Throws an error if any of the array element present in the map. */
function validateDuplicateKeys(keys, constantLabels) {
    const keysAndConstantKeys = new Set([...keys, ...constantLabels.keys()].map(k => k.key));
    if (keysAndConstantKeys.size !== keys.length + constantLabels.size) {
        throw new Error(`The keys from LabelKeys should not be present in constantLabels or LabelKeys should not contains duplicate keys`);
    }
}
exports.validateDuplicateKeys = validateDuplicateKeys;
//# sourceMappingURL=validations.js.map