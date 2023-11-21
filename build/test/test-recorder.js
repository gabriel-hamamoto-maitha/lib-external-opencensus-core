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
const types_1 = require("../src/stats/types");
/** The order of how close values must be to be considerated almost equal */
const EPSILON = 6;
function isAlmostEqual(actual, expected, epsilon) {
    return Math.abs(actual - expected) < Math.pow(10, -epsilon);
}
function assertDistributionData(distributionData, values) {
    const valuesSum = values.reduce((acc, cur) => acc + cur);
    assert.strictEqual(distributionData.count, values.length);
    assert.strictEqual(distributionData.sum, valuesSum);
    const expectedMean = valuesSum / values.length;
    assert.ok(isAlmostEqual(distributionData.mean, expectedMean, EPSILON));
    const expectedSumSquaredDeviations = values
        .map(value => Math.pow(value - expectedMean, 2))
        .reduce((acc, curr) => acc + curr);
    assert.ok(isAlmostEqual(distributionData.sumOfSquaredDeviation, expectedSumSquaredDeviations, EPSILON));
    const expectedStdDeviation = Math.sqrt(expectedSumSquaredDeviations / values.length);
    assert.ok(isAlmostEqual(distributionData.stdDeviation, expectedStdDeviation, EPSILON));
}
describe('Recorder', () => {
    const measures = [
        {
            name: 'Test Measure 1',
            type: types_1.MeasureType.DOUBLE,
            unit: types_1.MeasureUnit.UNIT,
        },
        { name: 'Test Measure 2', type: types_1.MeasureType.INT64, unit: types_1.MeasureUnit.UNIT },
    ];
    const tagValues = [{ value: 'testValue' }];
    const testCases = [
        { values: [1.1, 2.5, 3.2, 4.7, 5.2], description: 'with positive values' },
        {
            values: [-1.5, -2.3, -3.7, -4.3, -5.9],
            description: 'with negative values',
        },
        { values: [0, 0, 0, 0], description: 'with zeros' },
        { values: [1.1, -2.3, 3.2, -4.3, 5.2], description: 'with mixed values' },
    ];
    for (const measure of measures) {
        describe(`for count aggregation data of ${measure.type} values`, () => {
            for (const testCase of testCases) {
                it(`should record measurements ${testCase.description} correctly`, () => {
                    const countData = {
                        type: types_1.AggregationType.COUNT,
                        tagValues,
                        timestamp: Date.now(),
                        value: 0,
                    };
                    let count = 0;
                    for (const value of testCase.values) {
                        count++;
                        const measurement = { measure, value };
                        const updatedAggregationData = src_1.Recorder.addMeasurement(countData, measurement);
                        assert.strictEqual(updatedAggregationData.value, count);
                    }
                });
            }
        });
        describe(`for last value aggregation data of ${measure.type} values`, () => {
            for (const testCase of testCases) {
                it(`should record measurements ${testCase.description} correctly`, () => {
                    const lastValueData = {
                        type: types_1.AggregationType.LAST_VALUE,
                        tagValues,
                        timestamp: Date.now(),
                        value: 0,
                    };
                    for (const value of testCase.values) {
                        const measurement = { measure, value };
                        const lastValue = measure.type === types_1.MeasureType.DOUBLE ? value : Math.trunc(value);
                        const updatedAggregationData = src_1.Recorder.addMeasurement(lastValueData, measurement);
                        assert.strictEqual(updatedAggregationData.value, lastValue);
                    }
                });
            }
        });
        describe(`for sum aggregation data of ${measure.type} values`, () => {
            for (const testCase of testCases) {
                it(`should record measurements ${testCase.description} correctly`, () => {
                    const sumData = {
                        type: types_1.AggregationType.SUM,
                        tagValues,
                        timestamp: Date.now(),
                        value: 0,
                    };
                    let acc = 0;
                    for (const value of testCase.values) {
                        acc +=
                            measure.type === types_1.MeasureType.DOUBLE ? value : Math.trunc(value);
                        const measurement = { measure, value };
                        const updatedAggregationData = src_1.Recorder.addMeasurement(sumData, measurement);
                        assert.strictEqual(updatedAggregationData.value, acc);
                    }
                });
            }
        });
        describe(`for distribution aggregation data of ${measure.type} values`, () => {
            for (const testCase of testCases) {
                it(`should record measurements ${testCase.description} correctly`, () => {
                    const distributionData = {
                        type: types_1.AggregationType.DISTRIBUTION,
                        tagValues,
                        timestamp: Date.now(),
                        startTime: Date.now(),
                        count: 0,
                        sum: 0,
                        mean: 0,
                        stdDeviation: 0,
                        sumOfSquaredDeviation: 0,
                        buckets: [2, 4, 6],
                        bucketCounts: [0, 0, 0, 0],
                    };
                    const sentValues = [];
                    for (const value of testCase.values) {
                        sentValues.push(measure.type === types_1.MeasureType.DOUBLE ? value : Math.trunc(value));
                        const measurement = { measure, value };
                        const updatedAggregationData = src_1.Recorder.addMeasurement(distributionData, measurement);
                        assertDistributionData(updatedAggregationData, sentValues);
                    }
                });
            }
        });
        describe('for distribution aggregation data with attachments', () => {
            const attachments = { k1: 'v1', k2: 'v2', k3: 'v3' };
            it('should record measurements and attachments correctly', () => {
                const distributionData = {
                    type: types_1.AggregationType.DISTRIBUTION,
                    tagValues,
                    timestamp: Date.now(),
                    startTime: Date.now(),
                    count: 0,
                    sum: 0,
                    mean: 0,
                    stdDeviation: 0,
                    sumOfSquaredDeviation: 0,
                    buckets: [2, 4, 6],
                    bucketCounts: [0, 0, 0, 0],
                    exemplars: new Array(4),
                };
                const value = 5;
                const measurement = { measure, value };
                const aggregationData = src_1.Recorder.addMeasurement(distributionData, measurement, attachments);
                assert.strictEqual(aggregationData.sum, 5);
                assert.strictEqual(aggregationData.mean, 5);
                assert.deepStrictEqual(aggregationData.buckets, [2, 4, 6]);
                assert.deepStrictEqual(aggregationData.bucketCounts, [0, 0, 1, 0]);
                assert.deepStrictEqual(aggregationData.exemplars[0], undefined);
                assert.deepStrictEqual(aggregationData.exemplars[1], undefined);
                assert.deepStrictEqual(aggregationData.exemplars[2], {
                    value: 5,
                    timestamp: aggregationData.timestamp,
                    attachments,
                });
                assert.deepStrictEqual(aggregationData.exemplars[3], undefined);
            });
        });
        describe('getTagValues()', () => {
            const CALLER = { name: 'caller' };
            const METHOD = { name: 'method' };
            const ORIGINATOR = { name: 'originator' };
            const CALLER_V = { value: 'some caller' };
            const METHOD_V = { value: 'some method' };
            const ORIGINATOR_V = { value: 'some originator' };
            const NO_PROPAGATION_MD = { tagTtl: src_1.TagTtl.NO_PROPAGATION };
            const UNLIMITED_PROPAGATION_MD = { tagTtl: src_1.TagTtl.UNLIMITED_PROPAGATION };
            let tagMap;
            beforeEach(() => {
                tagMap = new src_1.TagMap();
            });
            it('should return tag values from tags and columns', () => {
                const columns = [CALLER, METHOD];
                tagMap.set(CALLER, CALLER_V);
                tagMap.set(METHOD, METHOD_V);
                const tagValues = src_1.Recorder.getTagValues(tagMap.tags, columns);
                assert.strictEqual(tagValues.length, 2);
                assert.deepStrictEqual(tagValues, [CALLER_V, METHOD_V]);
            });
            it('should return tag values from tags and columns when using metadata', () => {
                const columns = [CALLER, METHOD];
                tagMap.set(CALLER, CALLER_V, NO_PROPAGATION_MD);
                tagMap.set(METHOD, METHOD_V, UNLIMITED_PROPAGATION_MD);
                const tagValues = src_1.Recorder.getTagValues(tagMap.tags, columns);
                assert.strictEqual(tagValues.length, 2);
                assert.deepStrictEqual(tagValues, [CALLER_V, METHOD_V]);
            });
            it('should return tag values from tags and columns with extra keys', () => {
                const columns = [CALLER, METHOD, ORIGINATOR];
                tagMap.set(CALLER, CALLER_V);
                tagMap.set(METHOD, METHOD_V);
                const tagValues = src_1.Recorder.getTagValues(tagMap.tags, columns);
                assert.strictEqual(tagValues.length, 3);
                assert.deepStrictEqual(tagValues, [CALLER_V, METHOD_V, null]);
            });
            it('should return tag values from tags and columns with extra tags', () => {
                const columns = [CALLER, METHOD];
                tagMap.set(CALLER, CALLER_V);
                tagMap.set(METHOD, METHOD_V);
                tagMap.set(ORIGINATOR, ORIGINATOR_V);
                const tagValues = src_1.Recorder.getTagValues(tagMap.tags, columns);
                assert.strictEqual(tagValues.length, 2);
                assert.deepStrictEqual(tagValues, [CALLER_V, METHOD_V]);
            });
        });
    }
});
//# sourceMappingURL=test-recorder.js.map