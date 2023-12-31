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
exports.CoreTracerBase = void 0;
const uuid = require("uuid");
const logger = require("../../common/console-logger");
const noop_propagation_1 = require("../propagation/noop-propagation");
const sampler_1 = require("../sampler/sampler");
const no_record_root_span_1 = require("./no-record/no-record-root-span");
const no_record_span_1 = require("./no-record/no-record-span");
const root_span_1 = require("./root-span");
const types = require("./types");
/**
 * This class represents a tracer.
 */
class CoreTracerBase {
    /** Constructs a new TraceImpl instance. */
    constructor() {
        /** A list of end span event listeners */
        this.eventListenersLocal = [];
        /** Bit to represent whether trace is sampled or not. */
        this.IS_SAMPLED = 0x1;
        /** An object to log information */
        this.logger = logger.logger();
        this.activeLocal = false;
        this.activeTraceParams = {};
    }
    /** A propagation instance */
    get propagation() {
        if (this.config && this.config.propagation) {
            return this.config.propagation;
        }
        return noop_propagation_1.noopPropagation;
    }
    /** Sets the current root span. */
    setCurrentRootSpan(root) {
        // no-op, this is only required in case of tracer with cls.
    }
    /**
     * Starts a tracer.
     * @param config A tracer configuration object to start a tracer.
     */
    start(config) {
        this.activeLocal = true;
        this.config = config;
        this.logger = this.config.logger || logger.logger();
        this.sampler = sampler_1.SamplerBuilder.getSampler(config.samplingRate || sampler_1.DEFAULT_SAMPLING_RATE);
        if (config.traceParams) {
            this.activeTraceParams.numberOfAnnontationEventsPerSpan = sampler_1.TraceParamsBuilder.getNumberOfAnnotationEventsPerSpan(config.traceParams);
            this.activeTraceParams.numberOfAttributesPerSpan = sampler_1.TraceParamsBuilder.getNumberOfAttributesPerSpan(config.traceParams);
            this.activeTraceParams.numberOfMessageEventsPerSpan = sampler_1.TraceParamsBuilder.getNumberOfMessageEventsPerSpan(config.traceParams);
            this.activeTraceParams.numberOfLinksPerSpan = sampler_1.TraceParamsBuilder.getNumberOfLinksPerSpan(config.traceParams);
        }
        return this;
    }
    /** Stops the tracer. */
    stop() {
        this.activeLocal = false;
        return this;
    }
    /** Gets the list of event listeners. */
    get eventListeners() {
        return this.eventListenersLocal;
    }
    /** Indicates if the tracer is active or not. */
    get active() {
        return this.activeLocal;
    }
    /**
     * Starts a root span.
     * @param options A TraceOptions object to start a root span.
     * @param fn A callback function to run after starting a root span.
     */
    startRootSpan(options, fn) {
        const spanContext = options.spanContext || {
            spanId: '',
            traceId: uuid
                .v4()
                .split('-')
                .join(''),
        };
        const parentSpanId = spanContext.spanId;
        const traceId = spanContext.traceId;
        const name = options.name || 'span';
        const kind = options.kind || types.SpanKind.UNSPECIFIED;
        const traceState = spanContext.traceState;
        // Tracer is active
        if (this.active) {
            const sampleDecision = this.makeSamplingDecision(options, traceId);
            // Sampling is on
            if (sampleDecision) {
                const rootSpan = new root_span_1.RootSpan(this, name, kind, traceId, parentSpanId, traceState);
                // Add default attributes
                const defaultAttributes = this.config && this.config.defaultAttributes;
                if (defaultAttributes) {
                    Object.keys(defaultAttributes).forEach(key => {
                        rootSpan.addAttribute(key, defaultAttributes[key]);
                    });
                }
                rootSpan.start();
                return fn(rootSpan);
            }
            // Sampling is off
            this.logger.debug('Sampling is off, starting new no record root span');
        }
        else {
            // Tracer is inactive
            this.logger.debug('Tracer is inactive, starting new no record root span');
        }
        const noRecordRootSpan = new no_record_root_span_1.NoRecordRootSpan(this, name, kind, traceId, parentSpanId, traceState);
        return fn(noRecordRootSpan);
    }
    /** Notifies listeners of the span start. */
    onStartSpan(span) {
        if (!this.active)
            return;
        this.notifyStartSpan(span);
    }
    /** Notifies listeners of the span end. */
    onEndSpan(span) {
        if (!this.active)
            return;
        this.notifyEndSpan(span);
    }
    /**
     * Registers an end span event listener.
     * @param listener The listener to register.
     */
    registerSpanEventListener(listener) {
        this.eventListenersLocal.push(listener);
    }
    /**
     * Unregisters an end span event listener.
     * @param listener The listener to unregister.
     */
    unregisterSpanEventListener(listener) {
        const index = this.eventListenersLocal.indexOf(listener, 0);
        if (index > -1) {
            this.eventListeners.splice(index, 1);
        }
    }
    notifyStartSpan(span) {
        this.logger.debug('starting to notify listeners the start of spans');
        for (const listener of this.eventListenersLocal) {
            listener.onStartSpan(span);
        }
    }
    notifyEndSpan(span) {
        this.logger.debug('starting to notify listeners the end of spans');
        for (const listener of this.eventListenersLocal) {
            listener.onEndSpan(span);
        }
    }
    /**
     * Starts a span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options) {
        if (!options || !options.childOf) {
            this.logger.debug('no current trace found - must start a new root span first');
            return new no_record_span_1.NoRecordSpan(this);
        }
        const span = options.childOf.startChildSpan(options);
        // Add default attributes
        const defaultAttributes = this.config && this.config.defaultAttributes;
        if (defaultAttributes) {
            Object.keys(defaultAttributes).forEach(key => {
                span.addAttribute(key, defaultAttributes[key]);
            });
        }
        return span;
    }
    /** Determine whether to sample request or not. */
    makeSamplingDecision(options, traceId) {
        // If users set a specific sampler in the TraceOptions, use it.
        if (options &&
            options.samplingRate !== undefined &&
            options.samplingRate !== null) {
            return sampler_1.SamplerBuilder.getSampler(options.samplingRate).shouldSample(traceId);
        }
        let propagatedSample = null;
        // if there is a context propagation, keep the decision
        if (options &&
            options.spanContext &&
            options.spanContext.options !== undefined) {
            propagatedSample = (options.spanContext.options & this.IS_SAMPLED) !== 0;
            return !!propagatedSample;
        }
        // default global sampler
        return this.sampler.shouldSample(traceId);
    }
}
exports.CoreTracerBase = CoreTracerBase;
//# sourceMappingURL=tracer-base.js.map