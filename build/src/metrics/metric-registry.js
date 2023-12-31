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
exports.MetricRegistry = void 0;
const time_util_1 = require("../common/time-util");
const validations_1 = require("../common/validations");
const types_1 = require("../stats/types");
const cumulative_1 = require("./cumulative/cumulative");
const derived_cumulative_1 = require("./cumulative/derived-cumulative");
const base_metric_producer_1 = require("./export/base-metric-producer");
const types_2 = require("./export/types");
const derived_gauge_1 = require("./gauges/derived-gauge");
const gauge_1 = require("./gauges/gauge");
/**
 * Creates and manages application's set of metrics.
 */
class MetricRegistry {
    constructor() {
        this.registeredMetrics = new Map();
        this.metricProducer = new MetricProducerForRegistry(this.registeredMetrics);
    }
    /**
     * Builds a new Int64 gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Int64 Gauge metric.
     */
    addInt64Gauge(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const int64Gauge = new gauge_1.Gauge(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.GAUGE_INT64, labelKeysCopy, constantLabels);
        this.registerMetric(name, int64Gauge);
        return int64Gauge;
    }
    /**
     * Builds a new double gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Double Gauge metric.
     */
    addDoubleGauge(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const doubleGauge = new gauge_1.Gauge(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.GAUGE_DOUBLE, labelKeysCopy, constantLabels);
        this.registerMetric(name, doubleGauge);
        return doubleGauge;
    }
    /**
     * Builds a new derived Int64 gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Int64 DerivedGauge metric.
     */
    addDerivedInt64Gauge(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const derivedInt64Gauge = new derived_gauge_1.DerivedGauge(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.GAUGE_INT64, labelKeysCopy, constantLabels);
        this.registerMetric(name, derivedInt64Gauge);
        return derivedInt64Gauge;
    }
    /**
     * Builds a new derived double gauge to be added to the registry. This is more
     * convenient form when you want to manually increase and decrease values as
     * per your service requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Double DerivedGauge metric.
     */
    addDerivedDoubleGauge(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const derivedDoubleGauge = new derived_gauge_1.DerivedGauge(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.GAUGE_DOUBLE, labelKeysCopy, constantLabels);
        this.registerMetric(name, derivedDoubleGauge);
        return derivedDoubleGauge;
    }
    /**
     * Builds a new Int64 cumulative to be added to the registry. This API is
     * useful when you want to manually increase and reset values as per service
     * requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Int64 Cumulative metric.
     */
    addInt64Cumulative(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const int64Cumulative = new cumulative_1.Cumulative(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.CUMULATIVE_INT64, labelKeysCopy, constantLabels);
        this.registerMetric(name, int64Cumulative);
        return int64Cumulative;
    }
    /**
     * Builds a new double cumulative to be added to the registry. This API is
     * useful when you want to manually increase and reset values as per service
     * requirements.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Double Cumulative metric.
     */
    addDoubleCumulative(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const doubleCumulative = new cumulative_1.Cumulative(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.CUMULATIVE_DOUBLE, labelKeysCopy, constantLabels);
        this.registerMetric(name, doubleCumulative);
        return doubleCumulative;
    }
    /**
     * Builds a new derived Int64 Cumulative to be added to the registry.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Int64 DerivedCumulative metric.
     */
    addDerivedInt64Cumulative(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const startTime = time_util_1.getTimestampWithProcessHRTime();
        const derivedInt64Cumulative = new derived_cumulative_1.DerivedCumulative(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.CUMULATIVE_INT64, labelKeysCopy, constantLabels, startTime);
        this.registerMetric(name, derivedInt64Cumulative);
        return derivedInt64Cumulative;
    }
    /**
     * Builds a new derived Double Cumulative to be added to the registry.
     *
     * @param name The name of the metric.
     * @param options The options for the metric.
     * @returns A Double DerivedCumulative metric.
     */
    addDerivedDoubleCumulative(name, options) {
        const description = (options && options.description) || MetricRegistry.DEFAULT_DESCRIPTION;
        const unit = (options && options.unit) || MetricRegistry.DEFAULT_UNIT;
        const labelKeys = (options && options.labelKeys) || MetricRegistry.DEFAULT_LABEL_KEYS;
        const constantLabels = (options && options.constantLabels) ||
            MetricRegistry.DEFAULT_CONSTANT_LABEL;
        // TODO(mayurkale): Add support for resource
        this.validateLables(labelKeys, constantLabels);
        const labelKeysCopy = Object.assign([], labelKeys);
        const startTime = time_util_1.getTimestampWithProcessHRTime();
        const derivedDoubleCumulative = new derived_cumulative_1.DerivedCumulative(validations_1.validateNotNull(name, MetricRegistry.NAME), description, unit, types_2.MetricDescriptorType.CUMULATIVE_DOUBLE, labelKeysCopy, constantLabels, startTime);
        this.registerMetric(name, derivedDoubleCumulative);
        return derivedDoubleCumulative;
    }
    /**
     * Registers metric to register.
     *
     * @param name The name of the metric.
     * @param meter The metric to register.
     */
    registerMetric(name, meter) {
        if (this.registeredMetrics.has(name)) {
            throw new Error(`A metric with the name ${name} has already been registered.`);
        }
        this.registeredMetrics.set(name, meter);
    }
    /**
     * Gets a metric producer for registry.
     *
     * @returns The metric producer.
     */
    getMetricProducer() {
        return this.metricProducer;
    }
    /** Validates labelKeys and constantLabels. */
    validateLables(labelKeys, constantLabels) {
        validations_1.validateArrayElementsNotNull(labelKeys, MetricRegistry.LABEL_KEY);
        validations_1.validateMapElementNotNull(constantLabels, MetricRegistry.CONSTANT_LABELS);
        validations_1.validateDuplicateKeys(labelKeys, constantLabels);
    }
}
exports.MetricRegistry = MetricRegistry;
MetricRegistry.NAME = 'name';
MetricRegistry.LABEL_KEY = 'labelKey';
MetricRegistry.CONSTANT_LABELS = 'constantLabels';
MetricRegistry.DEFAULT_DESCRIPTION = '';
MetricRegistry.DEFAULT_UNIT = types_1.MeasureUnit.UNIT;
MetricRegistry.DEFAULT_LABEL_KEYS = [];
MetricRegistry.DEFAULT_CONSTANT_LABEL = new Map();
/**
 * A MetricProducerForRegistry is a producer that can be registered for
 * exporting using MetricProducerManager.
 */
class MetricProducerForRegistry extends base_metric_producer_1.BaseMetricProducer {
    constructor(registeredMetrics) {
        super();
        this.registeredMetrics = registeredMetrics;
    }
    /**
     * Gets a collection of produced Metric`s to be exported.
     *
     * @returns The list of metrics.
     */
    getMetrics() {
        return Array.from(this.registeredMetrics.values())
            .map(meter => meter.getMetric())
            .filter(meter => !!meter);
    }
}
//# sourceMappingURL=metric-registry.js.map