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
exports.BaseStats = void 0;
const defaultLogger = require("../common/console-logger");
const cls = require("../internal/cls");
const metrics_1 = require("../metrics/metrics");
const tagger = require("../tags/tagger");
const metric_producer_1 = require("./metric-producer");
const types_1 = require("./types");
const view_1 = require("./view");
class BaseStats {
    /**
     * Creates stats
     * @param logger
     */
    constructor(logger = defaultLogger) {
        /** A list of Stats exporters */
        this.statsEventListeners = [];
        /** A map of Measures (name) to their corresponding Views */
        this.registeredViews = {};
        this.logger = logger.logger();
        this.contextManager = cls.getNamespace();
        // Create a new MetricProducerForStats and register it to
        // MetricProducerManager when Stats is initialized.
        const metricProducer = new metric_producer_1.MetricProducerForStats(this);
        metrics_1.Metrics.getMetricProducerManager().add(metricProducer);
    }
    /** Gets the stats instance. */
    static get instance() {
        return this.singletonInstance || (this.singletonInstance = new this());
    }
    /**
     * Registers a view to listen to new measurements in its measure.
     * @param view The view to be registered
     */
    registerView(view) {
        if (this.registeredViews[view.measure.name]) {
            this.registeredViews[view.measure.name].push(view);
        }
        else {
            this.registeredViews[view.measure.name] = [view];
        }
        view.registered = true;
        // Notifies all exporters
        for (const exporter of this.statsEventListeners) {
            // tslint:disable-next-line:deprecation
            exporter.onRegisterView(view);
        }
    }
    /**
     * Creates a view.
     * @param name The view name
     * @param measure The view measure
     * @param aggregation The view aggregation type
     * @param tagKeys The view columns (tag keys)
     * @param description The view description
     * @param bucketBoundaries An optional The view bucket boundaries for a
     *     distribution aggregation type
     */
    createView(name, measure, aggregation, tagKeys, description, bucketBoundaries) {
        const view = new view_1.BaseView(name, measure, aggregation, tagKeys, description, bucketBoundaries);
        return view;
    }
    /**
     * Registers an exporter to send stats data to a service.
     * @param exporter An stats exporter
     */
    registerExporter(exporter) {
        this.statsEventListeners.push(exporter);
        for (const measureName of Object.keys(this.registeredViews)) {
            for (const view of this.registeredViews[measureName]) {
                // tslint:disable-next-line:deprecation
                exporter.onRegisterView(view);
            }
        }
        exporter.start();
    }
    /**
     * Unregisters an exporter. It should be called whenever the exporter is not
     * needed anymore.
     * @param exporter An stats exporter
     */
    unregisterExporter(exporter) {
        if (exporter) {
            this.statsEventListeners = this.statsEventListeners.filter(currentExporter => currentExporter !== exporter);
            exporter.stop();
        }
    }
    /**
     * Creates a measure of type Double.
     * @param name The measure name
     * @param unit The measure unit
     * @param description An optional measure description
     */
    createMeasureDouble(name, unit, description) {
        return { name, unit, type: types_1.MeasureType.DOUBLE, description };
    }
    /**
     * Creates a measure of type Int64. Values must be integers up to
     * Number.MAX_SAFE_INTERGER.
     * @param name The measure name
     * @param unit The measure unit
     * @param description An optional measure description
     */
    createMeasureInt64(name, unit, description) {
        return { name, unit, type: types_1.MeasureType.INT64, description };
    }
    /**
     * Verifies whether all measurements has positive value
     * @param measurements A list of measurements
     * @returns Whether values is positive
     */
    hasNegativeValue(measurements) {
        return measurements.some(measurement => measurement.value < 0);
    }
    /**
     * Gets a collection of produced Metric`s to be exported.
     * @returns The List of metrics.
     */
    getMetrics() {
        const metrics = [];
        for (const measureName of Object.keys(this.registeredViews)) {
            for (const view of this.registeredViews[measureName]) {
                metrics.push(view.getMetric(view.startTime));
            }
        }
        return metrics;
    }
    /**
     * Updates all views with the new measurements.
     * @param measurements A list of measurements to record
     * @param tags optional The tags to which the value is applied.
     *     tags could either be explicitly passed to the method, or implicitly
     *     read from current execution context.
     * @param attachments optional The contextual information associated with an
     *     example value. THe contextual information is represented as key - value
     *     string pairs.
     */
    record(measurements, tags, attachments) {
        if (this.hasNegativeValue(measurements)) {
            this.logger.warn(`Dropping measurments ${measurements}, value to record
          must be non-negative.`);
            return;
        }
        if (!tags) {
            // Record against implicit (current) context
            tags = this.getCurrentTagContext();
        }
        for (const measurement of measurements) {
            const views = this.registeredViews[measurement.measure.name];
            if (!views) {
                break;
            }
            // Updates all views
            for (const view of views) {
                view.recordMeasurement(measurement, tags, attachments);
            }
            // Notifies all exporters
            for (const exporter of this.statsEventListeners) {
                // tslint:disable-next-line:deprecation
                exporter.onRecord(views, measurement, tags.tags);
            }
        }
    }
    /**
     * Remove all registered Views and exporters from the stats.
     */
    clear() {
        this.registeredViews = {};
        this.statsEventListeners = [];
    }
    /**
     * Enters the scope of code where the given `TagMap` is in the current context
     * (replacing the previous `TagMap`).
     * @param tags The TagMap to be set to the current context.
     * @param fn Callback function.
     * @returns The callback return.
     */
    withTagContext(tags, fn) {
        return tagger.withTagContext(this.contextManager, tags, fn);
    }
    /** Gets the current tag context. */
    getCurrentTagContext() {
        return tagger.getCurrentTagContext(this.contextManager);
    }
}
exports.BaseStats = BaseStats;
//# sourceMappingURL=stats.js.map