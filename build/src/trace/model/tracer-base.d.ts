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
import * as loggerTypes from '../../common/types';
import * as configTypes from '../config/types';
import { TraceParams } from '../config/types';
import { Propagation } from '../propagation/types';
import * as samplerTypes from '../sampler/types';
import * as types from './types';
/**
 * This class represents a tracer.
 */
export declare class CoreTracerBase implements types.TracerBase {
    /** Indicates if the tracer is active */
    private activeLocal;
    /** A configuration for starting the tracer */
    private config;
    /** A list of end span event listeners */
    private eventListenersLocal;
    /** Bit to represent whether trace is sampled or not. */
    private readonly IS_SAMPLED;
    /** A sampler used to make sample decisions */
    sampler: samplerTypes.Sampler;
    /** An object to log information */
    logger: loggerTypes.Logger;
    /** A configuration object for trace parameters */
    activeTraceParams: TraceParams;
    /** Constructs a new TraceImpl instance. */
    constructor();
    /** A propagation instance */
    get propagation(): Propagation;
    /** Sets the current root span. */
    setCurrentRootSpan(root: types.Span): void;
    /**
     * Starts a tracer.
     * @param config A tracer configuration object to start a tracer.
     */
    start(config: configTypes.TracerConfig): this;
    /** Stops the tracer. */
    stop(): this;
    /** Gets the list of event listeners. */
    get eventListeners(): types.SpanEventListener[];
    /** Indicates if the tracer is active or not. */
    get active(): boolean;
    /**
     * Starts a root span.
     * @param options A TraceOptions object to start a root span.
     * @param fn A callback function to run after starting a root span.
     */
    startRootSpan<T>(options: types.TraceOptions, fn: (root: types.Span) => T): T;
    /** Notifies listeners of the span start. */
    onStartSpan(span: types.Span): void;
    /** Notifies listeners of the span end. */
    onEndSpan(span: types.Span): void;
    /**
     * Registers an end span event listener.
     * @param listener The listener to register.
     */
    registerSpanEventListener(listener: types.SpanEventListener): void;
    /**
     * Unregisters an end span event listener.
     * @param listener The listener to unregister.
     */
    unregisterSpanEventListener(listener: types.SpanEventListener): void;
    private notifyStartSpan;
    private notifyEndSpan;
    /**
     * Starts a span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options?: types.SpanOptions): types.Span;
    /** Determine whether to sample request or not. */
    private makeSamplingDecision;
}
