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
import * as types from '../types';
import { NoRecordSpan } from './no-record-span';
/** Implementation for the Span class that does not record trace events. */
export declare class NoRecordRootSpan extends NoRecordSpan {
    /** Its trace ID. */
    private traceIdLocal;
    /** Its trace state. */
    private traceStateLocal?;
    /**
     * This span's parent Id.  This is a string and not a Span because the
     * parent was likely started on another machine.
     */
    private parentSpanIdLocal;
    /** A tracer object */
    readonly tracer: types.TracerBase;
    /**
     * Constructs a new NoRecordRootSpanImpl instance.
     * @param tracer A tracer object.
     * @param name The displayed name for the new span.
     * @param kind The kind of new span.
     * @param traceId The trace Id.
     * @param parentSpanId The id of the parent span, or empty if the new span is
     *     a root span.
     * @param traceState Optional traceState.
     */
    constructor(tracer: types.TracerBase, name: string, kind: types.SpanKind, traceId: string, parentSpanId: string, traceState?: types.TraceState);
    /** Returns whether a span is root or not. */
    isRootSpan(): boolean;
    /** No-op implementation of this method. */
    get traceId(): string;
    /** Gets the ID of the parent span. */
    get parentSpanId(): string;
    /** No-op implementation of this method. */
    get traceState(): types.TraceState | undefined;
    /** No-op implementation of this method. */
    get numberOfChildren(): number;
    /** No-op implementation of this method. */
    start(): void;
    /** No-op implementation of this method. */
    end(): void;
}
