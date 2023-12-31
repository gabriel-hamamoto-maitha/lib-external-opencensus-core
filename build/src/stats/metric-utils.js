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
exports.MetricUtils = void 0;
const types_1 = require("../metrics/export/types");
const types_2 = require("./types");
/** Utils to convert Stats data models to Metric data models */
class MetricUtils {
    /**
     * Gets the corresponding metric type for the given stats type.
     * @param measure The measure for which to find a metric type
     * @param aggregation The aggregation for which to find a metric type
     * @returns The Type of metric descriptor
     */
    static getType(measure, aggregation) {
        if (aggregation === types_2.AggregationType.SUM) {
            switch (measure.type) {
                case types_2.MeasureType.INT64:
                    return types_1.MetricDescriptorType.CUMULATIVE_INT64;
                case types_2.MeasureType.DOUBLE:
                    return types_1.MetricDescriptorType.CUMULATIVE_DOUBLE;
                default:
                    throw new Error(`Unknown measure type ${measure.type}`);
            }
        }
        else if (aggregation === types_2.AggregationType.COUNT) {
            return types_1.MetricDescriptorType.CUMULATIVE_INT64;
        }
        else if (aggregation === types_2.AggregationType.DISTRIBUTION) {
            return types_1.MetricDescriptorType.CUMULATIVE_DISTRIBUTION;
        }
        else if (aggregation === types_2.AggregationType.LAST_VALUE) {
            switch (measure.type) {
                case types_2.MeasureType.INT64:
                    return types_1.MetricDescriptorType.GAUGE_INT64;
                case types_2.MeasureType.DOUBLE:
                    return types_1.MetricDescriptorType.GAUGE_DOUBLE;
                default:
                    throw new Error(`Unknown measure type ${measure.type}`);
            }
        }
        throw new Error(`Unknown aggregation type ${aggregation}`);
    }
    /**
     * Gets a MetricDescriptor for given view.
     * @param view The view for which to build a metric descriptor
     * @returns The MetricDescriptor.
     */
    static viewToMetricDescriptor(view) {
        return {
            name: view.name,
            description: view.description,
            unit: view.measure.unit,
            type: MetricUtils.getType(view.measure, view.aggregation),
            labelKeys: view.getColumns().map(
            // TODO(mayurkale): add description
            tagKey => ({ key: tagKey.name, description: '' })),
        };
    }
    /**
     * Converts tag values to label values.
     * @param tagValues the list of tag values
     * @returns The List of label values
     */
    static tagValuesToLabelValues(tagValues) {
        return tagValues.map(tagValue => ({
            value: tagValue ? tagValue.value : null,
        }));
    }
}
exports.MetricUtils = MetricUtils;
//# sourceMappingURL=metric-utils.js.map