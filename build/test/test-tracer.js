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
const no_record_span_1 = require("../src/trace/model/no-record/no-record-span");
const span_1 = require("../src/trace/model/span");
const tracer_1 = require("../src/trace/model/tracer");
const types = require("../src/trace/model/types");
const defaultConfig = {
    samplingRate: 1.0,
};
describe('Tracer', () => {
    const options = { name: 'test' };
    /** Should create a Tracer instance */
    describe('new Tracer()', () => {
        it('should create a Tracer instance', () => {
            const tracer = new tracer_1.CoreTracer();
            assert.ok(tracer instanceof tracer_1.CoreTracer);
        });
    });
    /** Should get/set the current RootSpan from tracer instance */
    describe('get/set currentRootSpan()', () => {
        const tracer = new tracer_1.CoreTracer().start(defaultConfig);
        it('should get the current RootSpan from tracer instance', () => {
            tracer.startRootSpan(options, root => {
                assert.ok(root);
                assert.ok(tracer.currentRootSpan instanceof span_1.Span);
                assert.strictEqual(tracer.currentRootSpan, root);
            });
        });
    });
    /** Should create and start a new RootSpan instance with options */
    describe('startRootSpan() with options', () => {
        let rootSpanLocal;
        let tracer;
        before(() => {
            tracer = new tracer_1.CoreTracer();
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                rootSpanLocal = rootSpan;
            });
        });
        it('should create a new RootSpan instance', () => {
            assert.ok(rootSpanLocal instanceof span_1.Span);
        });
        it('should set current root span', () => {
            tracer.startRootSpan(options, rootSpan => {
                assert.ok(tracer.currentRootSpan instanceof span_1.Span);
                assert.strictEqual(tracer.currentRootSpan, rootSpan);
            });
        });
    });
    /** Should set the current root span to null */
    describe('clearCurrentRootSpan()', () => {
        it('should set the current root span to null', () => {
            const tracer = new tracer_1.CoreTracer();
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                assert.ok(tracer.currentRootSpan instanceof span_1.Span);
                assert.strictEqual(tracer.currentRootSpan, rootSpan);
                tracer.clearCurrentTrace();
                assert.strictEqual(tracer.currentRootSpan, null);
            });
        });
    });
    /** Should create and start a Span instance into a rootSpan */
    describe('startChildSpan()', () => {
        let span;
        let rootSpanLocal;
        let tracer;
        before(() => {
            tracer = new tracer_1.CoreTracer();
            tracer.start(defaultConfig);
            tracer.startRootSpan(options, rootSpan => {
                rootSpanLocal = rootSpan;
                span = tracer.startChildSpan({
                    name: 'spanName',
                    kind: types.SpanKind.CLIENT,
                });
            });
        });
        it('should create a Span instance', () => {
            assert.ok(span instanceof span_1.Span);
        });
        it('should set child of to root span automatically', () => {
            assert.strictEqual(rootSpanLocal.numberOfChildren, 1);
            assert.ok(span.id);
            // instance equal is not possible due circular dependencies
            assert.strictEqual(rootSpanLocal.spans[0].id, span.id);
        });
    });
    /** Should not create a Span instance */
    describe('startChildSpan() before startRootSpan()', () => {
        it('should create a NoRecordSpan instance, without a rootspan', () => {
            const tracer = new tracer_1.CoreTracer();
            tracer.start(defaultConfig);
            const span = tracer.startChildSpan({
                name: 'spanName',
                kind: types.SpanKind.UNSPECIFIED,
            });
            assert.ok(span instanceof no_record_span_1.NoRecordSpan);
        });
    });
});
//# sourceMappingURL=test-tracer.js.map