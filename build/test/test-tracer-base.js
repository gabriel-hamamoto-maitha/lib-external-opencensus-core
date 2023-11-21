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
const assert = require("assert");
const uuid = require("uuid");
const util_1 = require("../src/internal/util");
const no_record_root_span_1 = require("../src/trace/model/no-record/no-record-root-span");
const no_record_span_1 = require("../src/trace/model/no-record/no-record-span");
const span_1 = require("../src/trace/model/span");
const tracer_base_1 = require("../src/trace/model/tracer-base");
const types = require("../src/trace/model/types");
class OnEndSpanClass {
    constructor() {
        /** Counter for test use */
        this.testCount = 0;
    }
    onStartSpan(span) { }
    /** Happens when a span is ended */
    onEndSpan(span) {
        this.testCount++;
    }
}
const defaultConfig = {
    samplingRate: 1.0,
};
describe('Tracer Base', () => {
    const options = { name: 'test' };
    /** Should create a Tracer instance */
    describe('new Tracer()', () => {
        it('should create a Tracer instance', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            assert.ok(tracer instanceof tracer_base_1.CoreTracerBase);
        });
    });
    /** Should return a started tracer instance */
    describe('start()', () => {
        let tracerStarted;
        before(() => {
            const tracer = new tracer_base_1.CoreTracerBase();
            assert.strictEqual(tracer.active, false);
            tracerStarted = tracer.start(defaultConfig);
        });
        it('should return a tracer instance', () => {
            assert.ok(tracerStarted instanceof tracer_base_1.CoreTracerBase);
        });
        it('the trace was started', () => {
            assert.strictEqual(tracerStarted.active, true);
        });
    });
    /** Should return an OnEndSpanEventListener list */
    describe('registerSpanEventListener() / get eventListeners()', () => {
        let tracer, onEndSpan;
        before(() => {
            tracer = new tracer_base_1.CoreTracerBase();
            onEndSpan = new OnEndSpanClass();
            tracer.registerSpanEventListener(onEndSpan);
        });
        it('should register a new OnEndSpanEventListener on listeners list', () => {
            const listener = tracer.eventListeners[0];
            assert.strictEqual(tracer.eventListeners.length, 1);
            assert.strictEqual(listener, onEndSpan);
        });
        it('should return an OnEndSpanEventListener list', () => {
            for (const listener of tracer.eventListeners) {
                assert.ok(listener instanceof OnEndSpanClass);
            }
        });
    });
    /** Should unregister a OnEndSpanEventlistener */
    describe('unregisterSpanEventListener()', () => {
        let tracer, onEndSpan;
        before(() => {
            tracer = new tracer_base_1.CoreTracerBase();
            onEndSpan = new OnEndSpanClass();
            tracer.registerSpanEventListener(onEndSpan);
        });
        it('should register a new OnEndSpanEventListener on listeners list', () => {
            const listener = tracer.eventListeners[0];
            assert.strictEqual(tracer.eventListeners.length, 1);
            assert.strictEqual(listener, onEndSpan);
            tracer.unregisterSpanEventListener(onEndSpan);
            assert.strictEqual(tracer.eventListeners.length, 0);
        });
    });
    /** Should stop the trace instance */
    describe('stop()', () => {
        it('should stop the trace instance', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            assert.strictEqual(tracer.active, false);
            tracer.start(defaultConfig);
            assert.strictEqual(tracer.active, true);
            tracer.stop();
            assert.strictEqual(tracer.active, false);
        });
    });
    /** Should create and start a new RootSpan instance with options */
    describe('startRootSpan() with options', () => {
        let rootSpanLocal;
        before(() => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                rootSpanLocal = rootSpan;
            });
        });
        it('should create a new RootSpan instance', () => {
            assert.ok(rootSpanLocal instanceof span_1.Span);
        });
        it('should start the rootSpan', () => {
            assert.ok(rootSpanLocal.started);
        });
    });
    describe('startRootSpan() with sampler never', () => {
        const tracer = new tracer_base_1.CoreTracerBase();
        const config = { samplingRate: 0 };
        it('should start the new NoRecordRootSpan instance', () => {
            tracer.start(config);
            tracer.startRootSpan(options, rootSpan => {
                assert.ok(rootSpan instanceof no_record_root_span_1.NoRecordRootSpan);
            });
        });
        it('should start the new RootSpan instance when always sampling provided at span level', () => {
            tracer.start(config);
            tracer.startRootSpan({ name: 'test', samplingRate: 1 }, rootSpan => {
                assert.ok(rootSpan);
            });
        });
    });
    describe('startRootSpan() with sampler always', () => {
        const tracer = new tracer_base_1.CoreTracerBase();
        const config = { samplingRate: 1 };
        it('should start the new RootSpan instance', () => {
            tracer.start(config);
            tracer.startRootSpan(options, rootSpan => {
                assert.ok(rootSpan);
            });
        });
        it('should start the new NoRecordRootSpan instance when never sampling provided at span level', () => {
            tracer.start(config);
            tracer.startRootSpan({ name: 'test', samplingRate: 0 }, rootSpan => {
                assert.ok(rootSpan instanceof no_record_root_span_1.NoRecordRootSpan);
            });
        });
    });
    describe('startRootSpan() before start()', () => {
        it('should start the new NoRecordRootSpan instance, tracer not started', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            assert.strictEqual(tracer.active, false);
            tracer.startRootSpan(options, rootSpan => {
                assert.ok(rootSpan instanceof no_record_root_span_1.NoRecordRootSpan);
            });
        });
    });
    describe('startRootSpan() with context propagation', () => {
        const traceOptions = {
            name: 'rootName',
            kind: types.SpanKind.UNSPECIFIED,
        };
        it('should create new RootSpan instance, no propagation', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            tracer.startRootSpan(traceOptions, rootSpan => {
                assert.ok(rootSpan);
                assert.strictEqual(rootSpan.name, traceOptions.name);
                assert.strictEqual(rootSpan.kind, traceOptions.kind);
            });
        });
        const spanContextPropagated = {
            traceId: uuid
                .v4()
                .split('-')
                .join(''),
            spanId: util_1.randomSpanId(),
            options: 0x1,
        };
        it('should create the new RootSpan with propagation', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            traceOptions.spanContext = spanContextPropagated;
            tracer.startRootSpan(traceOptions, rootSpan => {
                assert.ok(rootSpan);
                assert.strictEqual(rootSpan.name, traceOptions.name);
                assert.strictEqual(rootSpan.kind, traceOptions.kind);
                assert.strictEqual(rootSpan.traceId, spanContextPropagated.traceId);
                assert.strictEqual(rootSpan.parentSpanId, spanContextPropagated.spanId);
            });
        });
        it('should create the new NoRecordRootSpan with propagation options bit set to not-sample)', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            traceOptions.spanContext.options = 0x0;
            tracer.startRootSpan(traceOptions, rootSpan => {
                assert.ok(rootSpan);
                assert.ok(rootSpan instanceof no_record_root_span_1.NoRecordRootSpan);
                assert.strictEqual(rootSpan.name, traceOptions.name);
                assert.strictEqual(rootSpan.kind, traceOptions.kind);
                assert.strictEqual(rootSpan.traceId, spanContextPropagated.traceId);
                assert.strictEqual(rootSpan.parentSpanId, spanContextPropagated.spanId);
            });
        });
        it('should create a tracer with default TraceParams when no parameters are specified upon initialisation', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            assert.strictEqual(tracer.activeTraceParams.numberOfAnnontationEventsPerSpan, undefined);
            assert.strictEqual(tracer.activeTraceParams.numberOfAttributesPerSpan, undefined);
            assert.strictEqual(tracer.activeTraceParams.numberOfLinksPerSpan, undefined);
            assert.strictEqual(tracer.activeTraceParams.numberOfMessageEventsPerSpan, undefined);
        });
        it('should create a tracer with default TraceParams when parameters with values higher than limit are specified upon initialisation', () => {
            const traceParametersWithHigherThanMaximumValues = {
                numberOfAnnontationEventsPerSpan: 50,
                numberOfMessageEventsPerSpan: 200,
                numberOfAttributesPerSpan: 37,
                numberOfLinksPerSpan: 45,
            };
            defaultConfig.traceParams = traceParametersWithHigherThanMaximumValues;
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            assert.strictEqual(tracer.activeTraceParams.numberOfAnnontationEventsPerSpan, 50);
            assert.strictEqual(tracer.activeTraceParams.numberOfAttributesPerSpan, 37);
            assert.strictEqual(tracer.activeTraceParams.numberOfLinksPerSpan, 45);
            assert.strictEqual(tracer.activeTraceParams.numberOfMessageEventsPerSpan, 200);
        });
    });
    /** Should create and start a Span instance into a rootSpan */
    describe('startChildSpan()', () => {
        let span;
        let tracer;
        before(() => {
            tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                span = tracer.startChildSpan({
                    name: 'spanName',
                    kind: types.SpanKind.CLIENT,
                    childOf: rootSpan,
                });
            });
        });
        it('should create a Span instance', () => {
            assert.ok(span instanceof span_1.Span);
        });
        it('should start a span', () => {
            assert.ok(span.started);
            assert.strictEqual(span.name, 'spanName');
            assert.strictEqual(span.kind, types.SpanKind.CLIENT);
        });
        it('should start a span with SpanObject', () => {
            tracer.startRootSpan(options, rootSpan => {
                const spanWithObject = tracer.startChildSpan({
                    name: 'my-span',
                    kind: types.SpanKind.SERVER,
                    childOf: rootSpan,
                });
                assert.ok(spanWithObject.started);
                assert.strictEqual(spanWithObject.name, 'my-span');
                assert.strictEqual(spanWithObject.kind, types.SpanKind.SERVER);
            });
        });
        it('should start a span with SpanObject-name', () => {
            tracer.startRootSpan(options, rootSpan => {
                const spanWithObject = tracer.startChildSpan({
                    name: 'my-span1',
                    childOf: rootSpan,
                });
                assert.ok(spanWithObject.started);
                assert.strictEqual(spanWithObject.name, 'my-span1');
                assert.strictEqual(spanWithObject.kind, types.SpanKind.UNSPECIFIED);
            });
        });
        it('should start a no-record span without params', () => {
            tracer.startRootSpan(options, rootSpan => {
                const spanWithObject = tracer.startChildSpan();
                assert.strictEqual(spanWithObject.name, 'no-record');
                assert.strictEqual(spanWithObject.kind, types.SpanKind.UNSPECIFIED);
            });
        });
        it('should support nested children', () => {
            tracer.startRootSpan(options, rootSpan => {
                assert.strictEqual(rootSpan.numberOfChildren, 0);
                const child1 = tracer.startChildSpan({
                    name: 'child1',
                    kind: types.SpanKind.UNSPECIFIED,
                    childOf: rootSpan,
                });
                assert.strictEqual(rootSpan.numberOfChildren, 1);
                assert.strictEqual(child1.numberOfChildren, 0);
                const child2 = tracer.startChildSpan({
                    name: 'child2',
                    kind: types.SpanKind.UNSPECIFIED,
                    childOf: rootSpan,
                });
                assert.strictEqual(rootSpan.numberOfChildren, 2);
                const grandchild1 = tracer.startChildSpan({
                    name: 'grandchild1',
                    kind: types.SpanKind.UNSPECIFIED,
                    childOf: child1,
                });
                assert.strictEqual(rootSpan.numberOfChildren, 2);
                assert.strictEqual(child1.numberOfChildren, 1);
                assert.strictEqual(child2.numberOfChildren, 0);
                assert.strictEqual(grandchild1.numberOfChildren, 0);
                assert.strictEqual(rootSpan.spans.length, 2);
                assert.strictEqual(child1, rootSpan.spans[0]);
                assert.strictEqual(child2, rootSpan.spans[1]);
                assert.strictEqual(grandchild1.parentSpanId, child1.id);
                assert.strictEqual(child1.spans.length, 1);
                assert.strictEqual(grandchild1, child1.spans[0]);
                assert.strictEqual(child2.spans.length, 0);
                assert.strictEqual(grandchild1.spans.length, 0);
                assert.strictEqual(rootSpan.allDescendants().length, 3);
            });
        });
        it('should add attributes more than default limit when override', () => {
            defaultConfig.traceParams = { numberOfAttributesPerSpan: 48 };
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                const span = tracer.startChildSpan({
                    name: 'spanName',
                    childOf: rootSpan,
                });
                for (let i = 0; i < 40; i++) {
                    span.addAttribute(`attr ${i}`, i);
                }
                assert.strictEqual(Object.keys(span.attributes).length, 40);
            });
        });
    });
    /** Should not create a Span instance */
    describe('startChildSpan() before startRootSpan()', () => {
        it('should create a NoRecordSpan instance, without a rootspan', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            tracer.start(defaultConfig);
            const span = tracer.startChildSpan({
                name: 'spanName',
                kind: types.SpanKind.UNSPECIFIED,
            });
            assert.ok(span instanceof no_record_span_1.NoRecordSpan);
        });
    });
    /** Should add tracer attributes to every span created by tracer */
    describe('startRootSpan() and startChildSpan() with attributes', () => {
        let tracerConfig;
        let tracer;
        let span;
        let rootSpanLocal;
        before(() => {
            tracer = new tracer_base_1.CoreTracerBase();
            tracerConfig = Object.assign(Object.assign({}, defaultConfig), { defaultAttributes: {
                    cluster_name: 'test-cluster',
                    asg_name: 'test-asg',
                } });
            tracer.start(tracerConfig);
            tracer.startRootSpan(options, rootSpan => {
                rootSpanLocal = rootSpan;
                span = tracer.startChildSpan({
                    name: 'spanName',
                    kind: types.SpanKind.CLIENT,
                    childOf: rootSpan,
                });
            });
        });
        it('should add attributes to spans', () => {
            assert.deepStrictEqual(rootSpanLocal.attributes, tracerConfig.defaultAttributes);
            assert.deepStrictEqual(span.attributes, tracerConfig.defaultAttributes);
        });
    });
    /** Should run eventListeners when the rootSpan ends */
    describe('onEndSpan()', () => {
        it('should run eventListeners when the rootSpan ends', () => {
            const tracer = new tracer_base_1.CoreTracerBase();
            const eventListener = new OnEndSpanClass();
            tracer.registerSpanEventListener(eventListener);
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                rootSpan.end();
                assert.strictEqual(eventListener.testCount, tracer.eventListeners.length);
            });
        });
    });
});
//# sourceMappingURL=test-tracer-base.js.map