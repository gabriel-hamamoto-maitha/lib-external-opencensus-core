"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRecordSpan = void 0;
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
const noop_logger_1 = require("../../../common/noop-logger");
const util_1 = require("../../../internal/util");
const types = require("../types");
const STATUS_OK = {
    code: types.CanonicalCode.OK,
};
/** Implementation for the SpanBase class that does not record trace events. */
class NoRecordSpan {
    /** Constructs a new SpanBaseModel instance. */
    constructor(tracer, parent) {
        /** Indicates if this span was started */
        this.startedLocal = false;
        /** Indicates if this span was ended */
        this.endedLocal = false;
        /** An object to log information to */
        this.logger = noop_logger_1.noopLogger;
        /** A set of attributes, each in the format [KEY]:[VALUE] */
        this.attributes = {};
        /** A text annotation with a set of attributes. */
        this.annotations = [];
        /** An event describing a message sent/received between Spans */
        this.messageEvents = [];
        /** Pointers from the current span to another span */
        this.links = [];
        /** If the parent span is in another process. */
        this.remoteParent = false;
        /** The resource name of the span */
        this.name = 'no-record';
        /** Kind of span. */
        this.kind = types.SpanKind.UNSPECIFIED;
        /** A final status for this span */
        this.status = STATUS_OK;
        /** Trace Parameters */
        this.activeTraceParams = {};
        /** The number of dropped attributes. */
        this.droppedAttributesCount = 0;
        /** The number of dropped links. */
        this.droppedLinksCount = 0;
        /** The number of dropped annotations. */
        this.droppedAnnotationsCount = 0;
        /** The number of dropped message events. */
        this.droppedMessageEventsCount = 0;
        this.tracer = tracer;
        this.id = util_1.randomSpanId();
        if (parent) {
            this.root = parent.root;
            this.parentSpan = parent;
        }
        else {
            this.root = this;
        }
        this.logger = (this.root && this.root.logger) || this.logger;
    }
    /** Returns whether a span is root or not. */
    isRootSpan() {
        return false;
    }
    /** Gets trace id of no-record span. */
    get traceId() {
        return '';
    }
    /** Gets the trace state */
    get traceState() {
        return undefined;
    }
    /** Gets the ID of the parent span. */
    get parentSpanId() {
        if (!this.parentSpan) {
            return '';
        }
        return this.parentSpan.id;
    }
    /** Indicates if span was started. */
    get started() {
        return this.startedLocal;
    }
    /** Indicates if span was ended. */
    get ended() {
        return this.endedLocal;
    }
    /** No-op implementation of this method. */
    get startTime() {
        return new Date();
    }
    /** No-op implementation of this method. */
    allDescendants() {
        return [];
    }
    /** No-op implementation of this method. */
    get spans() {
        return [];
    }
    /** No-op implementation of this method. */
    get numberOfChildren() {
        return 0;
    }
    /** No-op implementation of this method. */
    get endTime() {
        return new Date();
    }
    /** Gives the TraceContext of the span. */
    get spanContext() {
        return {
            traceId: this.traceId,
            spanId: this.id,
            options: 0,
            traceState: this.traceState,
        };
    }
    /** No-op implementation of this method. */
    get duration() {
        return 0;
    }
    /** No-op implementation of this method. */
    addAttribute(key, value) { }
    /** No-op implementation of this method. */
    addAnnotation(description, attributes, timestamp = 0) { }
    /** No-op implementation of this method. */
    addLink(traceId, spanId, type, attributes) { }
    /** No-op implementation of this method. */
    addMessageEvent(type, id, timestamp = 0, uncompressedSize, compressedSize) { }
    /** No-op implementation of this method. */
    setStatus(code, message) { }
    /** No-op implementation of this method. */
    start() {
        this.startedLocal = true;
    }
    /** No-op implementation of this method. */
    end() {
        this.startedLocal = false;
        this.endedLocal = true;
    }
    /** No-op implementation of this method. */
    truncate() { }
    /**
     * Starts a new no record child span in the no record root span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options) {
        const noRecordChild = new NoRecordSpan(this.tracer, this);
        if (options && options.name)
            noRecordChild.name = options.name;
        if (options && options.kind)
            noRecordChild.kind = options.kind;
        noRecordChild.start();
        return noRecordChild;
    }
}
exports.NoRecordSpan = NoRecordSpan;
//# sourceMappingURL=no-record-span.js.map