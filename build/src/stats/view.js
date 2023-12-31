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
exports.BaseView = void 0;
const defaultLogger = require("../common/console-logger");
const time_util_1 = require("../common/time-util");
const types_1 = require("../metrics/export/types");
const validation_1 = require("../tags/validation");
const bucket_boundaries_1 = require("./bucket-boundaries");
const metric_utils_1 = require("./metric-utils");
const recorder_1 = require("./recorder");
const types_2 = require("./types");
const RECORD_SEPARATOR = String.fromCharCode(30);
/**
 * A View specifies an aggregation and a set of tag keys. The aggregation will
 * be broken down by the unique set of matching tag values for each measure.
 */
class BaseView {
    /**
     * Creates a new View instance. This constructor is used by Stats. User should
     * prefer using Stats.createView() instead.
     * @param name The view name
     * @param measure The view measure
     * @param aggregation The view aggregation type
     * @param tagsKeys The Tags' keys that view will have
     * @param description The view description
     * @param bucketBoundaries The view bucket boundaries for a distribution
     *     aggregation type
     * @param logger
     */
    constructor(name, measure, aggregation, tagsKeys, description, bucketBoundaries, logger = defaultLogger) {
        /**
         * A map of stringified tags representing columns labels or tag keys, concept
         * similar to dimensions on multidimensional modeling, to AggregationData.
         * If no Tags are provided, then, all data is recorded in a single
         * aggregation.
         */
        this.tagValueAggregationMap = {};
        /** true if the view was registered */
        this.registered = false;
        if (aggregation === types_2.AggregationType.DISTRIBUTION && !bucketBoundaries) {
            throw new Error('No bucketBoundaries specified');
        }
        this.logger = logger.logger();
        this.name = name;
        this.description = description;
        this.measure = measure;
        this.columns = this.validateTagKeys(tagsKeys);
        this.aggregation = aggregation;
        this.startTime = Date.now();
        if (bucketBoundaries) {
            this.bucketBoundaries = new bucket_boundaries_1.BucketBoundaries(bucketBoundaries);
        }
        this.metricDescriptor = metric_utils_1.MetricUtils.viewToMetricDescriptor(this);
    }
    /** Gets the view's tag keys */
    getColumns() {
        return this.columns;
    }
    /**
     * Records a measurement in the proper view's row. This method is used by
     * Stats. User should prefer using Stats.record() instead.
     *
     * Measurements with measurement type INT64 will have its value truncated.
     * @param measurement The measurement to record
     * @param tags The tags to which the value is applied
     * @param attachments optional The contextual information associated with an
     *     example value. The contextual information is represented as key - value
     *     string pairs.
     */
    recordMeasurement(measurement, tags, attachments) {
        const tagValues = recorder_1.Recorder.getTagValues(tags.tags, this.columns);
        const encodedTags = this.encodeTagValues(tagValues);
        if (!this.tagValueAggregationMap[encodedTags]) {
            this.tagValueAggregationMap[encodedTags] = this.createAggregationData(tagValues);
        }
        recorder_1.Recorder.addMeasurement(this.tagValueAggregationMap[encodedTags], measurement, attachments);
    }
    /**
     * Encodes a TagValue object into a value sorted string.
     * @param tagValues The tagValues to encode
     */
    encodeTagValues(tagValues) {
        return tagValues
            .map(tagValue => (tagValue ? tagValue.value : null))
            .sort()
            .join(RECORD_SEPARATOR);
    }
    /**
     * Creates an empty aggregation data for a given tags.
     * @param tagValues The tags for that aggregation data
     */
    createAggregationData(tagValues) {
        const aggregationMetadata = { tagValues, timestamp: Date.now() };
        switch (this.aggregation) {
            case types_2.AggregationType.DISTRIBUTION:
                const { buckets, bucketCounts } = this.bucketBoundaries;
                const bucketsCopy = Object.assign([], buckets);
                const bucketCountsCopy = Object.assign([], bucketCounts);
                const exemplars = new Array(bucketCounts.length);
                return Object.assign(Object.assign({}, aggregationMetadata), { type: types_2.AggregationType.DISTRIBUTION, startTime: this.startTime, count: 0, sum: 0, mean: 0, stdDeviation: 0, sumOfSquaredDeviation: 0, buckets: bucketsCopy, bucketCounts: bucketCountsCopy, exemplars });
            case types_2.AggregationType.SUM:
                return Object.assign(Object.assign({}, aggregationMetadata), { type: types_2.AggregationType.SUM, value: 0 });
            case types_2.AggregationType.COUNT:
                return Object.assign(Object.assign({}, aggregationMetadata), { type: types_2.AggregationType.COUNT, value: 0 });
            default:
                return Object.assign(Object.assign({}, aggregationMetadata), { type: types_2.AggregationType.LAST_VALUE, value: 0 });
        }
    }
    /**
     * Gets view`s metric
     * @param start The start timestamp in epoch milliseconds
     * @returns The Metric.
     */
    getMetric(start) {
        const { type } = this.metricDescriptor;
        let startTimestamp;
        // The moment when this point was recorded.
        const now = time_util_1.getTimestampWithProcessHRTime();
        if (type !== types_1.MetricDescriptorType.GAUGE_INT64 &&
            type !== types_1.MetricDescriptorType.GAUGE_DOUBLE) {
            startTimestamp = time_util_1.timestampFromMillis(start);
        }
        const timeseries = [];
        Object.keys(this.tagValueAggregationMap).forEach(key => {
            const { tagValues } = this.tagValueAggregationMap[key];
            const labelValues = metric_utils_1.MetricUtils.tagValuesToLabelValues(tagValues);
            const point = this.toPoint(now, this.getSnapshot(tagValues));
            if (startTimestamp) {
                timeseries.push({ startTimestamp, labelValues, points: [point] });
            }
            else {
                timeseries.push({ labelValues, points: [point] });
            }
        });
        return { descriptor: this.metricDescriptor, timeseries };
    }
    /**
     * Converts snapshot to point
     * @param timestamp The timestamp
     * @param data The aggregated data
     * @returns The Point.
     */
    toPoint(timestamp, data) {
        if (data.type === types_2.AggregationType.DISTRIBUTION) {
            const { count, sum, sumOfSquaredDeviation, exemplars } = data;
            const buckets = [];
            if (data.bucketCounts) {
                for (let bucket = 0; bucket < data.bucketCounts.length; bucket++) {
                    const bucketCount = data.bucketCounts[bucket];
                    const statsExemplar = exemplars ? exemplars[bucket] : undefined;
                    buckets.push(this.getMetricBucket(bucketCount, statsExemplar));
                }
            }
            const value = {
                count,
                sum,
                sumOfSquaredDeviation,
                buckets,
                bucketOptions: { explicit: { bounds: data.buckets } },
            };
            return { timestamp, value };
        }
        else {
            const value = data.value;
            return { timestamp, value };
        }
    }
    /**
     * Returns a snapshot of an AggregationData for that tags/labels values.
     * @param tags The desired data's tags
     * @returns The AggregationData.
     */
    getSnapshot(tagValues) {
        return this.tagValueAggregationMap[this.encodeTagValues(tagValues)];
    }
    /** Returns a Bucket with count and examplar (if present) */
    getMetricBucket(bucketCount, statsExemplar) {
        if (statsExemplar) {
            // Bucket with an Exemplar.
            return {
                count: bucketCount,
                exemplar: {
                    value: statsExemplar.value,
                    timestamp: time_util_1.timestampFromMillis(statsExemplar.timestamp),
                    attachments: statsExemplar.attachments,
                },
            };
        }
        // Bucket with no Exemplar.
        return { count: bucketCount };
    }
    /** Determines whether the given TagKeys are valid. */
    validateTagKeys(tagKeys) {
        const tagKeysCopy = Object.assign([], tagKeys);
        tagKeysCopy.forEach(tagKey => {
            if (!validation_1.isValidTagKey(tagKey)) {
                throw new Error(`Invalid TagKey name: ${tagKey}`);
            }
        });
        const tagKeysSet = new Set(tagKeysCopy.map((tagKey) => tagKey.name));
        if (tagKeysSet.size !== tagKeysCopy.length) {
            throw new Error('Columns have duplicate');
        }
        return tagKeysCopy;
    }
}
exports.BaseView = BaseView;
//# sourceMappingURL=view.js.map