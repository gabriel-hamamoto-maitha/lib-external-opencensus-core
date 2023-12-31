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
import { LabelValue } from './export/types';
import { LengthAttributeInterface, LengthMethodInterface, SizeAttributeInterface, SizeMethodInterface, ToValueInterface } from './types';
/**
 * Returns a string(comma separated) from the list of label values.
 *
 * @param labelValues The list of the label values.
 * @returns The hashed label values string.
 */
export declare function hashLabelValues(labelValues: LabelValue[]): string;
/**
 * Returns default label values.
 *
 * @param count The number of label values.
 * @returns The list of the label values.
 */
export declare function initializeDefaultLabels(count: number): LabelValue[];
export declare function isLengthAttributeInterface(obj: any): obj is LengthAttributeInterface;
export declare function isLengthMethodInterface(obj: any): obj is LengthMethodInterface;
export declare function isSizeAttributeInterface(obj: any): obj is SizeAttributeInterface;
export declare function isSizeMethodInterface(obj: any): obj is SizeMethodInterface;
export declare function isToValueInterface(obj: any): obj is ToValueInterface;
