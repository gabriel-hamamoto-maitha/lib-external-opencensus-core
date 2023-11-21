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
const assert = require("assert");
const src_1 = require("../src");
const types_1 = require("../src/metrics/export/types");
const types_2 = require("../src/stats/types");
describe('MetricUtil', () => {
    it('should convert view to MetricDescriptor', () => {
        const VIEW_DESCRIPTION = 'view description';
        const measure = {
            name: 'Test Measure',
            type: types_2.MeasureType.DOUBLE,
            unit: types_2.MeasureUnit.UNIT,
        };
        const tagKeys = [{ name: 'testKey1' }, { name: 'testKey2' }];
        const view = new src_1.BaseView('test/view/name', measure, types_2.AggregationType.LAST_VALUE, tagKeys, VIEW_DESCRIPTION);
        const metricDescriptor = src_1.MetricUtils.viewToMetricDescriptor(view);
        assert.ok(metricDescriptor);
        assert.strictEqual(metricDescriptor.name, view.name);
        assert.strictEqual(metricDescriptor.unit, types_2.MeasureUnit.UNIT);
        assert.strictEqual(metricDescriptor.type, types_1.MetricDescriptorType.GAUGE_DOUBLE);
        assert.strictEqual(metricDescriptor.description, VIEW_DESCRIPTION);
        assert.deepStrictEqual(metricDescriptor.labelKeys, [
            { key: 'testKey1', description: '' },
            { key: 'testKey2', description: '' },
        ]);
    });
    it('should convert tag values to label values', () => {
        const tags = [
            { value: 'value1' },
            { value: 'value2' },
            { value: '' },
            null,
        ];
        assert.deepStrictEqual(src_1.MetricUtils.tagValuesToLabelValues(tags), [
            { value: 'value1' },
            { value: 'value2' },
            { value: '' },
            { value: null },
        ]);
    });
    it('should convert tag values to label values with null tag value', () => {
        const tags = [{ value: 'value1' }, null, null, null];
        assert.deepStrictEqual(src_1.MetricUtils.tagValuesToLabelValues(tags), [
            { value: 'value1' },
            { value: null },
            { value: null },
            { value: null },
        ]);
    });
});
//# sourceMappingURL=test-metric-utils.js.map