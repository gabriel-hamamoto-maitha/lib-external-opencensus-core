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
exports.CoreTracer = void 0;
const cls = require("../../internal/cls");
const no_record_span_1 = require("./no-record/no-record-span");
const tracer_base_1 = require("./tracer-base");
/**
 * This class represents a tracer with Continuation Local Storage (CLS).
 *
 * CLS helps keep tracking the root span over function calls automatically.
 * It is capable of storing, propagating and retrieving arbitrary
 * continuation-local data (also called "context").
 * CLS comes with some performance overhead, you can read more about it here:
 * https://github.com/othiym23/node-continuation-local-storage/issues/59
 */
class CoreTracer extends tracer_base_1.CoreTracerBase {
    /** Constructs a new TraceImpl instance. */
    constructor() {
        super();
        this.contextManager = cls.getNamespace();
        this.clearCurrentTrace();
    }
    /** Gets the current root span. */
    get currentRootSpan() {
        return this.contextManager.get('rootspan');
    }
    /** Sets the current root span. */
    set currentRootSpan(root) {
        this.setCurrentRootSpan(root);
    }
    /** Sets the current root span. */
    setCurrentRootSpan(root) {
        if (this.contextManager.active) {
            this.contextManager.set('rootspan', root);
        }
    }
    /**
     * Starts a root span.
     * @param options A TraceOptions object to start a root span.
     * @param fn A callback function to run after starting a root span.
     */
    startRootSpan(options, fn) {
        const self = this;
        return self.contextManager.runAndReturn(() => {
            return super.startRootSpan(options, root => {
                return fn(root);
            });
        });
    }
    /** Notifies listeners of the span start. */
    onStartSpan(span) {
        if (!this.active)
            return;
        if (!this.currentRootSpan ||
            this.currentRootSpan.traceId !== span.traceId) {
            this.logger.debug('currentRootSpan != root on notifyStart. Need more investigation.');
        }
        return super.onStartSpan(span);
    }
    /** Notifies listeners of the span end. */
    onEndSpan(span) {
        if (!this.active)
            return;
        if (!this.currentRootSpan ||
            this.currentRootSpan.traceId !== span.traceId) {
            this.logger.debug('currentRootSpan != root on notifyEnd. Need more investigation.');
        }
        super.onEndSpan(span);
    }
    /** Clears the current root span. */
    clearCurrentTrace() {
        if (this.contextManager.active) {
            this.contextManager.set('rootspan', null);
        }
    }
    /**
     * Starts a span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options) {
        if (!this.currentRootSpan) {
            this.logger.debug('no current trace found - must start a new root span first');
        }
        return super.startChildSpan(Object.assign({ childOf: this.currentRootSpan || new no_record_span_1.NoRecordSpan(this) }, options));
    }
    /**
     * Binds the trace context to the given function.
     * This is necessary in order to create child spans correctly in functions
     * that are called asynchronously (for example, in a network response
     * handler).
     * @param fn A function to which to bind the trace context.
     */
    wrap(fn) {
        if (!this.active) {
            return fn;
        }
        const namespace = this.contextManager;
        return namespace.bind(fn);
    }
    /**
     * Binds the trace context to the given event emitter.
     * This is necessary in order to create child spans correctly in event
     * handlers.
     * @param emitter An event emitter whose handlers should have
     *     the trace context binded to them.
     */
    wrapEmitter(emitter) {
        if (!this.active) {
            return;
        }
        const namespace = this.contextManager;
        namespace.bindEmitter(emitter);
    }
}
exports.CoreTracer = CoreTracer;
//# sourceMappingURL=tracer.js.map