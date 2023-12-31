"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Span = void 0;
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
const noop_logger_1 = require("../../common/noop-logger");
const clock_1 = require("../../internal/clock");
const util_1 = require("../../internal/util");
const no_record_span_1 = require("./no-record/no-record-span");
const types = require("./types");
const STATUS_OK = {
    code: types.CanonicalCode.OK,
};
/** Defines a base model for spans. */
class Span {
    /** Constructs a new Span instance. */
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
        this.name = 'span';
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
        this.className = this.constructor.name;
        this.id = util_1.randomSpanId();
        this.spansLocal = [];
        if (parent) {
            this.root = parent.root;
            this.parentSpan = parent;
            this.activeTraceParams = this.root.activeTraceParams;
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
    /** Gets the trace ID. */
    get traceId() {
        return this.root.traceId;
    }
    /** Gets the trace state */
    get traceState() {
        return this.root.traceState;
    }
    /**
     * Gets the ID of the parent span.
     * RootSpan doesn't have a parentSpan but it override this method.
     */
    get parentSpanId() {
        if (!this.parentSpan) {
            return 'no-parent';
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
    /**
     * Gives a timestamp that indicates the span's start time in RFC3339 UTC
     * "Zulu" format.
     */
    get startTime() {
        if (!this.clock) {
            this.logger.debug('calling startTime() on null clock');
            return new Date();
        }
        return this.clock.startTime;
    }
    /** Recursively gets the descendant spans. */
    allDescendants() {
        return this.spansLocal.reduce((acc, cur) => {
            acc.push(cur);
            const desc = cur.allDescendants();
            acc = acc.concat(desc);
            return acc;
        }, []);
    }
    /** The list of immediate child spans. */
    get spans() {
        return this.spansLocal;
    }
    /** The number of direct children. */
    get numberOfChildren() {
        return this.spansLocal.length;
    }
    /**
     * Gives a timestamp that indicates the span's end time in RFC3339 UTC
     * "Zulu" format.
     */
    get endTime() {
        if (!this.clock) {
            this.logger.debug('calling endTime() on null clock');
            return new Date();
        }
        return this.clock.endTime;
    }
    /**
     * Gets the duration of the clock.
     */
    get duration() {
        if (!this.clock) {
            this.logger.debug('calling duration() on null clock');
            return 0;
        }
        return this.clock.duration;
    }
    /** Gives the TraceContext of the span. */
    get spanContext() {
        return {
            traceId: this.traceId,
            spanId: this.id,
            options: 0x1,
            traceState: this.traceState,
        };
    }
    /**
     * Adds an atribute to the span.
     * @param key Describes the value added.
     * @param value The result of an operation. If the value is a typeof object
     *     it has to be JSON.stringify-able, cannot contain circular dependencies.
     */
    addAttribute(key, value) {
        if (this.attributes[key]) {
            delete this.attributes[key];
        }
        if (Object.keys(this.attributes).length >=
            this.activeTraceParams.numberOfAttributesPerSpan) {
            this.droppedAttributesCount++;
            const attributeKeyToDelete = Object.keys(this.attributes).shift();
            if (attributeKeyToDelete) {
                delete this.attributes[attributeKeyToDelete];
            }
        }
        const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
        this.attributes[key] = serializedValue;
    }
    /**
     * Adds an annotation to the span.
     * @param description Describes the event.
     * @param attributes A set of attributes on the annotation.
     * @param timestamp A time, in milliseconds. Defaults to Date.now()
     */
    addAnnotation(description, attributes = {}, timestamp = Date.now()) {
        if (this.annotations.length >=
            this.activeTraceParams.numberOfAnnontationEventsPerSpan) {
            this.annotations.shift();
            this.droppedAnnotationsCount++;
        }
        this.annotations.push({ description, attributes, timestamp });
    }
    /**
     * Adds a link to the span.
     * @param traceId The trace ID for a trace within a project.
     * @param spanId The span ID for a span within a trace.
     * @param type The relationship of the current span relative to the linked.
     * @param attributes A set of attributes on the link.
     */
    addLink(traceId, spanId, type, attributes = {}) {
        if (this.links.length >= this.activeTraceParams.numberOfLinksPerSpan) {
            this.links.shift();
            this.droppedLinksCount++;
        }
        this.links.push({ traceId, spanId, type, attributes });
    }
    /**
     * Adds a message event to the span.
     * @param type The type of message event.
     * @param id An identifier for the message event.
     * @param timestamp A time in milliseconds. Defaults to Date.now()
     * @param uncompressedSize The number of uncompressed bytes sent or received
     * @param compressedSize The number of compressed bytes sent or received. If
     *     zero or undefined, assumed to be the same size as uncompressed.
     */
    addMessageEvent(type, id, timestamp = Date.now(), uncompressedSize, compressedSize) {
        if (this.messageEvents.length >=
            this.activeTraceParams.numberOfMessageEventsPerSpan) {
            this.messageEvents.shift();
            this.droppedMessageEventsCount++;
        }
        this.messageEvents.push({
            type,
            id,
            timestamp,
            uncompressedSize,
            compressedSize,
        });
    }
    /**
     * Sets a status to the span.
     * @param code The canonical status code.
     * @param message optional A developer-facing error message.
     */
    setStatus(code, message) {
        this.status = { code, message };
    }
    /** Starts the span. */
    start() {
        if (this.started) {
            this.logger.debug('calling %s.start() on already started %s %o', this.className, this.className, { id: this.id, name: this.name, type: this.kind });
            return;
        }
        // start child span's clock from root's current time to preserve integrity.
        if (this.parentSpan) {
            this.clock = new clock_1.Clock(this.parentSpan.clock.currentDate);
        }
        else {
            this.clock = new clock_1.Clock();
        }
        this.startedLocal = true;
        this.logger.debug('starting %s  %o', this.className, {
            traceId: this.traceId,
            id: this.id,
            name: this.name,
            parentSpanId: this.parentSpanId,
            traceState: this.traceState,
        });
        if (this.isRootSpan())
            this.tracer.setCurrentRootSpan(this);
        this.tracer.onStartSpan(this);
    }
    /** Ends the span and all of its children, recursively. */
    end() {
        if (this.ended) {
            this.logger.debug('calling %s.end() on already ended %s %o', this.className, this.className, { id: this.id, name: this.name, type: this.kind });
            return;
        }
        if (!this.started) {
            this.logger.error('calling %s.end() on un-started %s %o', this.className, this.className, { id: this.id, name: this.name, type: this.kind });
            return;
        }
        this.startedLocal = false;
        this.endedLocal = true;
        this.clock.end();
        // TODO: Should ending a span force its children to end by default?
        // Issue: https://github.com/open-telemetry/opentelemetry-node/issues/4
        for (const span of this.spansLocal) {
            if (!span.ended && span.started) {
                span.truncate();
            }
        }
        this.tracer.onEndSpan(this);
    }
    /** Forces the span to end. */
    truncate() {
        this.end();
        this.logger.debug('truncating %s  %o', this.className, {
            id: this.id,
            name: this.name,
        });
    }
    /**
     * Starts a new child span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options) {
        if (this.ended) {
            this.logger.debug('calling %s.startSpan() on ended %s %o', this.className, this.className, { id: this.id, name: this.name, kind: this.kind });
            return new no_record_span_1.NoRecordSpan(this.tracer);
        }
        if (!this.started) {
            this.logger.debug('calling %s.startSpan() on un-started %s %o', this.className, this.className, { id: this.id, name: this.name, kind: this.kind });
            return new no_record_span_1.NoRecordSpan(this.tracer);
        }
        const child = new Span(this.tracer, this);
        if (options && options.name)
            child.name = options.name;
        if (options && options.kind)
            child.kind = options.kind;
        child.start();
        this.spansLocal.push(child);
        return child;
    }
}
exports.Span = Span;
//# sourceMappingURL=span.js.map