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
import * as defaultLogger from '../common/console-logger';
import { StatsEventListener } from '../exporters/types';
import * as cls from '../internal/cls';
import { Metric } from '../metrics/export/types';
import { TagMap } from '../tags/tag-map';
import { TagKey } from '../tags/types';
import { AggregationType, Measure, Measurement, MeasureUnit, Stats, View } from './types';
export declare class BaseStats implements Stats {
    /** A list of Stats exporters */
    private statsEventListeners;
    /** A map of Measures (name) to their corresponding Views */
    private registeredViews;
    /** An object to log information to */
    private logger;
    /** Singleton instance */
    private static singletonInstance;
    /** Manage context automatic propagation */
    private contextManager;
    /**
     * Creates stats
     * @param logger
     */
    constructor(logger?: typeof defaultLogger);
    /** Gets the stats instance. */
    static get instance(): Stats;
    /**
     * Registers a view to listen to new measurements in its measure.
     * @param view The view to be registered
     */
    registerView(view: View): void;
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
    createView(name: string, measure: Measure, aggregation: AggregationType, tagKeys: TagKey[], description: string, bucketBoundaries?: number[]): View;
    /**
     * Registers an exporter to send stats data to a service.
     * @param exporter An stats exporter
     */
    registerExporter(exporter: StatsEventListener): void;
    /**
     * Unregisters an exporter. It should be called whenever the exporter is not
     * needed anymore.
     * @param exporter An stats exporter
     */
    unregisterExporter(exporter: StatsEventListener): void;
    /**
     * Creates a measure of type Double.
     * @param name The measure name
     * @param unit The measure unit
     * @param description An optional measure description
     */
    createMeasureDouble(name: string, unit: MeasureUnit, description?: string): Measure;
    /**
     * Creates a measure of type Int64. Values must be integers up to
     * Number.MAX_SAFE_INTERGER.
     * @param name The measure name
     * @param unit The measure unit
     * @param description An optional measure description
     */
    createMeasureInt64(name: string, unit: MeasureUnit, description?: string): Measure;
    /**
     * Verifies whether all measurements has positive value
     * @param measurements A list of measurements
     * @returns Whether values is positive
     */
    private hasNegativeValue;
    /**
     * Gets a collection of produced Metric`s to be exported.
     * @returns The List of metrics.
     */
    getMetrics(): Metric[];
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
    record(measurements: Measurement[], tags?: TagMap, attachments?: {
        [key: string]: string;
    }): void;
    /**
     * Remove all registered Views and exporters from the stats.
     */
    clear(): void;
    /**
     * Enters the scope of code where the given `TagMap` is in the current context
     * (replacing the previous `TagMap`).
     * @param tags The TagMap to be set to the current context.
     * @param fn Callback function.
     * @returns The callback return.
     */
    withTagContext<T>(tags: TagMap, fn: cls.Func<T>): T;
    /** Gets the current tag context. */
    getCurrentTagContext(): TagMap;
}
