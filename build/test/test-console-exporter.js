"use strict";
/**
 * Copyright 2018, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const src_1 = require("../src");
const console_exporter_1 = require("../src/exporters/console-exporter");
const root_span_1 = require("../src/trace/model/root-span");
const tracer_1 = require("../src/trace/model/tracer");
const tracer = new tracer_1.CoreTracer().start({ samplingRate: 1.0 });
const defaultBufferConfig = {
    bufferSize: 1,
    bufferTimeout: 20000,
};
const name = 'MySpanName';
const kind = src_1.SpanKind.SERVER;
const traceId = 'd4cda95b652f4a1592b449d5929fda1b';
const parentSpanId = '';
describe('NoopExporter', () => {
    /** Should do nothing when calling onEndSpan() */
    describe('onEndSpan()', () => {
        it('should do nothing', () => {
            const exporter = new console_exporter_1.NoopExporter();
            const rootSpan = new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId);
            exporter.onEndSpan(rootSpan);
            assert.ok(true);
        });
    });
    /** Should do anything when calling publish() */
    describe('publish()', () => {
        it('should do nothing', () => {
            const exporter = new console_exporter_1.NoopExporter();
            const rootSpan = new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId);
            const queue = [rootSpan];
            return exporter.publish(queue);
        });
    });
});
describe('ConsoleLogExporter', () => {
    /** Should end a span */
    describe('onEndSpan()', () => {
        it('should end a span', () => {
            const intercept = require('intercept-stdout');
            let capturedText = '';
            intercept((txt) => {
                capturedText += txt;
            });
            const exporter = new console_exporter_1.ConsoleExporter(defaultBufferConfig);
            const rootSpan1 = new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId);
            exporter.onEndSpan(rootSpan1);
            assert.strictEqual(capturedText, '');
            const rootSpan2 = new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId);
            exporter.onEndSpan(rootSpan2);
            [rootSpan1, rootSpan2].map(rootSpan => {
                assert.ok(capturedText.indexOf(rootSpan.traceId) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.id) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.name) >= 0);
            });
        });
    });
    /** Should publish the rootspan in queue */
    describe('publish()', () => {
        it('should publish the rootspans in queue', () => {
            const intercept = require('intercept-stdout');
            let capturedText = '';
            intercept((txt) => {
                capturedText += txt;
            });
            const exporter = new console_exporter_1.ConsoleExporter(defaultBufferConfig);
            const rootSpan = new root_span_1.RootSpan(tracer, name, kind, traceId, parentSpanId);
            rootSpan.start();
            rootSpan.startChildSpan({ name: 'name', kind: src_1.SpanKind.UNSPECIFIED });
            const queue = [rootSpan];
            return exporter.publish(queue).then(() => {
                assert.ok(capturedText.indexOf(rootSpan.traceId) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.id) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.name) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.spans[0].name) >= 0);
                assert.ok(capturedText.indexOf(rootSpan.spans[0].id) >= 0);
            });
        });
    });
});
//# sourceMappingURL=test-console-exporter.js.map