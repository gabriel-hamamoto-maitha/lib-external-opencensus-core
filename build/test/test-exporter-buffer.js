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
const src_1 = require("../src");
const logger = require("../src/common/console-logger");
const console_exporter_1 = require("../src/exporters/console-exporter");
const exporter_buffer_1 = require("../src/exporters/exporter-buffer");
const root_span_1 = require("../src/trace/model/root-span");
const tracer_1 = require("../src/trace/model/tracer");
const exporter = new console_exporter_1.NoopExporter();
const DEFAULT_BUFFER_SIZE = 3;
const DEFAULT_BUFFER_TIMEOUT = 2000; // time in milliseconds
const tracer = new tracer_1.CoreTracer().start({});
const defaultBufferConfig = {
    bufferSize: DEFAULT_BUFFER_SIZE,
    bufferTimeout: DEFAULT_BUFFER_TIMEOUT,
    logger: logger.logger(),
};
const name = 'MySpanName';
const kind = src_1.SpanKind.SERVER;
const traceId = 'd4cda95b652f4a1592b449d5929fda1b';
const parentSpanId = '';
const createRootSpans = (num) => {
    const rootSpans = [];
    for (let i = 0; i < num; i++) {
        const rootSpan = new root_span_1.RootSpan(tracer, `rootSpan.${i}`, kind, traceId, parentSpanId);
        rootSpan.start();
        for (let j = 0; j < 10; j++) {
            rootSpan.startChildSpan({
                name: `childSpan.${i}.${j}`,
                kind: src_1.SpanKind.CLIENT,
            });
        }
        rootSpans.push(rootSpan);
    }
    return rootSpans;
};
describe('ExporterBuffer', () => {
    /**
     * Should create a Buffer with exporter, DEFAULT_BUFFER_SIZE and
     * DEFAULT_BUFFER_TIMEOUT
     */
    describe('new ExporterBuffer()', () => {
        it('should create a Buffer instance', () => {
            const buffer = new exporter_buffer_1.ExporterBuffer(exporter, defaultBufferConfig);
            assert.ok(buffer instanceof exporter_buffer_1.ExporterBuffer);
        });
    });
    /**
     * Should return the Buffer
     */
    describe('setBufferSize', () => {
        it('should set BufferSize', () => {
            const buffer = new exporter_buffer_1.ExporterBuffer(exporter, defaultBufferConfig);
            const newBufferSize = DEFAULT_BUFFER_SIZE + 10;
            const bufferResize = buffer.setBufferSize(newBufferSize);
            assert.ok(bufferResize instanceof exporter_buffer_1.ExporterBuffer);
            assert.strictEqual(bufferResize.getBufferSize(), newBufferSize);
        });
    });
    /**
     * Should add one item to the Buffer
     */
    describe('addToBuffer', () => {
        it('should add one item to the Buffer', () => {
            const buffer = new exporter_buffer_1.ExporterBuffer(exporter, defaultBufferConfig);
            buffer.addToBuffer(new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId));
            assert.strictEqual(buffer.getQueue().length, 1);
        });
    });
    /**
     * Should force flush
     */
    describe('addToBuffer force flush ', () => {
        it('should force flush', () => {
            const buffer = new exporter_buffer_1.ExporterBuffer(exporter, defaultBufferConfig);
            const rootSpans = createRootSpans(DEFAULT_BUFFER_SIZE);
            for (const rootSpan of rootSpans) {
                buffer.addToBuffer(rootSpan);
            }
            assert.strictEqual(buffer.getQueue().length, buffer.getBufferSize());
            buffer.addToBuffer(new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId));
            assert.strictEqual(buffer.getQueue().length, 0);
        });
    });
    /**
     * Should flush by timeout
     */
    describe('addToBuffer force flush by timeout ', () => {
        it('should flush by timeout', done => {
            const buffer = new exporter_buffer_1.ExporterBuffer(exporter, defaultBufferConfig);
            buffer.addToBuffer(new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId));
            assert.strictEqual(buffer.getQueue().length, 1);
            setTimeout(() => {
                assert.strictEqual(buffer.getQueue().length, 0);
                done();
            }, DEFAULT_BUFFER_TIMEOUT + 100);
        }).timeout(5000);
    });
});
//# sourceMappingURL=test-exporter-buffer.js.map