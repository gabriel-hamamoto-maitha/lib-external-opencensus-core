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
import { LabelKey, LabelValue } from '../metrics/export/types';
/**
 * Validates that an object reference passed as a parameter to the calling
 * method is not null.
 *
 * @param reference An object reference.
 * @param errorMessage The exception message to use if the check fails.
 * @returns An object reference.
 */
export declare function validateNotNull<T>(reference: T, errorMessage: string): T;
/**
 * Validates that an array passed as a parameter doesn't contain null element.
 *
 * @param list The argument list to check for null.
 * @param errorMessage The exception message to use if the check fails.
 */
export declare function validateArrayElementsNotNull<T>(array: T[], errorMessage: string): void;
/** Throws an error if any of the map elements is null. */
export declare function validateMapElementNotNull<K, V>(map: Map<K, V>, errorMessage: string): void;
/** Throws an error if any of the array element present in the map. */
export declare function validateDuplicateKeys(keys: LabelKey[], constantLabels: Map<LabelKey, LabelValue>): void;
