"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const assert = require("assert");
const utils_1 = require("../src/metrics/utils");
describe('hashLabelValues', () => {
    const LABEL_VALUES = [{ value: '200' }];
    const LABEL_VALUES_WITH_NULL = [
        { value: '200' },
        { value: null },
    ];
    const LABEL_VALUES_1 = [{ value: '200' }, { value: '400' }];
    const LABEL_VALUES_2 = [{ value: '400' }, { value: '200' }];
    it('should return hash for single Value', () => {
        const hash = utils_1.hashLabelValues(LABEL_VALUES);
        assert.deepStrictEqual(hash, '200');
    });
    it('should return hash for Value and null', () => {
        const hash = utils_1.hashLabelValues(LABEL_VALUES_WITH_NULL);
        assert.deepStrictEqual(hash, '200,');
    });
    it('should return same hash for interchanged labels', () => {
        assert.deepStrictEqual(utils_1.hashLabelValues(LABEL_VALUES_1), utils_1.hashLabelValues(LABEL_VALUES_2));
    });
    it('should return empty string for empty array', () => {
        assert.deepStrictEqual(utils_1.hashLabelValues([]), '');
    });
});
describe('initializeDefaultLabels', () => {
    const UNSET_VALUE = { value: null };
    it('should return single default labels', () => {
        const labelValues = utils_1.initializeDefaultLabels(1);
        assert.deepStrictEqual(labelValues, [UNSET_VALUE]);
    });
    it('should return multiple default labels', () => {
        const labelValues = utils_1.initializeDefaultLabels(3);
        assert.deepStrictEqual(labelValues, [
            UNSET_VALUE,
            UNSET_VALUE,
            UNSET_VALUE,
        ]);
    });
});
//# sourceMappingURL=test-utils.js.map