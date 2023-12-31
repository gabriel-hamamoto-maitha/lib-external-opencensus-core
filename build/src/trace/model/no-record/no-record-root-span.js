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
exports.NoRecordRootSpan = void 0;
const logger = require("../../../common/console-logger");
const no_record_span_1 = require("./no-record-span");
/** Implementation for the Span class that does not record trace events. */
class NoRecordRootSpan extends no_record_span_1.NoRecordSpan {
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
    constructor(tracer, name, kind, traceId, parentSpanId, traceState) {
        super(tracer);
        this.tracer = tracer;
        this.traceIdLocal = traceId;
        this.name = name;
        this.kind = kind;
        this.parentSpanIdLocal = parentSpanId;
        if (traceState) {
            this.traceStateLocal = traceState;
        }
        this.logger = this.tracer.logger || logger.logger();
    }
    /** Returns whether a span is root or not. */
    isRootSpan() {
        return true;
    }
    /** No-op implementation of this method. */
    get traceId() {
        return this.traceIdLocal;
    }
    /** Gets the ID of the parent span. */
    get parentSpanId() {
        return this.parentSpanIdLocal;
    }
    /** No-op implementation of this method. */
    get traceState() {
        return this.traceStateLocal;
    }
    /** No-op implementation of this method. */
    get numberOfChildren() {
        return 0;
    }
    /** No-op implementation of this method. */
    start() {
        super.start();
    }
    /** No-op implementation of this method. */
    end() {
        super.end();
    }
}
exports.NoRecordRootSpan = NoRecordRootSpan;
//# sourceMappingURL=no-record-root-span.js.map