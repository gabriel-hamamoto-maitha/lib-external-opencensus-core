"use strict";
/**
 * Copyright 2019, OpenCensus Authors
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
exports.DerivedCumulative = void 0;
const time_util_1 = require("../../common/time-util");
const validations_1 = require("../../common/validations");
const util = require("../utils");
/**
 * DerivedCumulative metric is used to record aggregated metrics that
 * represents a single numerical value accumulated over a time interval.
 */
class DerivedCumulative {
    /**
     * Constructs a new DerivedCumulative instance.
     *
     * @param name The name of the metric.
     * @param description The description of the metric.
     * @param unit The unit of the metric.
     * @param type The type of metric.
     * @param labelKeys The list of the label keys.
     * @param constantLabels The map of constant labels for the Metric.
     * @param startTime The time when the cumulative metric start measuring the
     *     value.
     */
    constructor(name, description, unit, type, labelKeys, constantLabels, startTime) {
        this.constantLabels = constantLabels;
        this.registeredPoints = new Map();
        this.labelKeysLength = labelKeys.length;
        const keysAndConstantKeys = [...labelKeys, ...constantLabels.keys()];
        this.constantLabelValues = [...constantLabels.values()];
        this.metricDescriptor = {
            name,
            description,
            unit,
            type,
            labelKeys: keysAndConstantKeys,
        };
        this.startTime = startTime;
    }
    /**
     * Creates a TimeSeries. The value of a single point in the TimeSeries is
     * observed from an object or function. The ValueExtractor is invoked whenever
     * metrics are collected, meaning the reported value is up-to-date.
     *
     * @param labelValues The list of the label values.
     * @param objOrFn obj The obj to get the size or length or value from. If
     *     multiple options are available, the value (ToValueInterface) takes
     *     precedence first, followed by length and size. e.g value -> length ->
     *     size.
     *     fn is the function that will be called to get the current value
     *     of the cumulative.
     */
    createTimeSeries(labelValues, objOrFn) {
        validations_1.validateArrayElementsNotNull(validations_1.validateNotNull(labelValues, 'labelValues'), 'labelValue');
        validations_1.validateNotNull(objOrFn, 'obj');
        const hash = util.hashLabelValues(labelValues);
        if (this.registeredPoints.has(hash)) {
            throw new Error('A different time series with the same labels already exists.');
        }
        if (this.labelKeysLength !== labelValues.length) {
            throw new Error("Label Keys and Label Values don't have same size");
        }
        if (objOrFn instanceof Function) {
            this.extractor = objOrFn;
        }
        else if (util.isToValueInterface(objOrFn)) {
            this.extractor = () => objOrFn.getValue();
        }
        else if (util.isLengthAttributeInterface(objOrFn)) {
            this.extractor = () => objOrFn.length;
        }
        else if (util.isLengthMethodInterface(objOrFn)) {
            this.extractor = () => objOrFn.length();
        }
        else if (util.isSizeAttributeInterface(objOrFn)) {
            this.extractor = () => objOrFn.size;
        }
        else if (util.isSizeMethodInterface(objOrFn)) {
            this.extractor = () => objOrFn.size();
        }
        else {
            throw new Error('Unknown interface/object type');
        }
        this.registeredPoints.set(hash, {
            labelValues,
            extractor: this.extractor,
            prevValue: 0,
        });
    }
    /**
     * Removes the TimeSeries from the cumulative metric, if it is present. i.e.
     * references to previous Point objects are invalid (not part of the
     * metric).
     *
     * @param labelValues The list of label values.
     */
    removeTimeSeries(labelValues) {
        validations_1.validateNotNull(labelValues, 'labelValues');
        this.registeredPoints.delete(util.hashLabelValues(labelValues));
    }
    /**
     * Removes all TimeSeries from the cumulative metric. i.e. references to all
     * previous Point objects are invalid (not part of the metric).
     */
    clear() {
        this.registeredPoints.clear();
    }
    /**
     * Provides a Metric with one or more TimeSeries.
     *
     * @returns The Metric, or null if TimeSeries is not present in Metric.
     */
    getMetric() {
        if (this.registeredPoints.size === 0) {
            return null;
        }
        const timestamp = time_util_1.getTimestampWithProcessHRTime();
        return {
            descriptor: this.metricDescriptor,
            timeseries: Array.from(this.registeredPoints, ([_, cumulativeEntry]) => {
                const newValue = cumulativeEntry.extractor();
                const value = newValue > cumulativeEntry.prevValue
                    ? newValue
                    : cumulativeEntry.prevValue;
                cumulativeEntry.prevValue = value;
                return {
                    labelValues: [
                        ...cumulativeEntry.labelValues,
                        ...this.constantLabelValues,
                    ],
                    points: [{ value, timestamp }],
                    startTimestamp: this.startTime,
                };
            }),
        };
    }
}
exports.DerivedCumulative = DerivedCumulative;
//# sourceMappingURL=derived-cumulative.js.map