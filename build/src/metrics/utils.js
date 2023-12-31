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
exports.isToValueInterface = exports.isSizeMethodInterface = exports.isSizeAttributeInterface = exports.isLengthMethodInterface = exports.isLengthAttributeInterface = exports.initializeDefaultLabels = exports.hashLabelValues = void 0;
const COMMA_SEPARATOR = ',';
const UNSET_LABEL_VALUE = {
    value: null,
};
/**
 * Returns a string(comma separated) from the list of label values.
 *
 * @param labelValues The list of the label values.
 * @returns The hashed label values string.
 */
function hashLabelValues(labelValues) {
    return labelValues
        .map(lv => lv.value)
        .sort()
        .join(COMMA_SEPARATOR);
}
exports.hashLabelValues = hashLabelValues;
/**
 * Returns default label values.
 *
 * @param count The number of label values.
 * @returns The list of the label values.
 */
function initializeDefaultLabels(count) {
    return new Array(count).fill(UNSET_LABEL_VALUE);
}
exports.initializeDefaultLabels = initializeDefaultLabels;
// TODO(mayurkale): Consider to use unknown type instead of any for below
// functions, unknown type is available since TypeScript 3.0
// Fact: unknown acts like a type-safe version of any by requiring us to
// perform some type of checking before we can use the value of the unknown
// element or any of its properties.
// Checks if the specified collection is a LengthAttributeInterface.
function isLengthAttributeInterface(
// tslint:disable-next-line:no-any
obj) {
    return obj && typeof obj.length === 'number';
}
exports.isLengthAttributeInterface = isLengthAttributeInterface;
// Checks if the specified collection is a LengthMethodInterface.
function isLengthMethodInterface(
// tslint:disable-next-line:no-any
obj) {
    return obj && typeof obj.length === 'function';
}
exports.isLengthMethodInterface = isLengthMethodInterface;
// Checks if the specified collection is a SizeAttributeInterface.
function isSizeAttributeInterface(
// tslint:disable-next-line:no-any
obj) {
    return obj && typeof obj.size === 'number';
}
exports.isSizeAttributeInterface = isSizeAttributeInterface;
// Checks if the specified collection is a SizeMethodInterface.
// tslint:disable-next-line:no-any
function isSizeMethodInterface(obj) {
    return obj && typeof obj.size === 'function';
}
exports.isSizeMethodInterface = isSizeMethodInterface;
// Checks if the specified callbackFn is a ToValueInterface.
// tslint:disable-next-line:no-any
function isToValueInterface(obj) {
    return obj && typeof obj.getValue === 'function';
}
exports.isToValueInterface = isToValueInterface;
//# sourceMappingURL=utils.js.map