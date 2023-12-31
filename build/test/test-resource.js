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
const resource_1 = require("../src/resource/resource");
describe('Resource()', () => {
    before(() => {
        process.env.OC_RESOURCE_TYPE = 'k8s.io/container';
        process.env.OC_RESOURCE_LABELS =
            'k8s.io/pod/name="pod-xyz-123",k8s.io/container/name="c1",k8s.io/namespace/name="default"';
        resource_1.CoreResource.setup();
    });
    after(() => {
        delete process.env.OC_RESOURCE_TYPE;
        delete process.env.OC_RESOURCE_LABELS;
    });
    it('should return resource information from environment variables', () => {
        const resource = resource_1.CoreResource.createFromEnvironmentVariables();
        const actualLabels = resource.labels;
        const expectedLabels = {
            'k8s.io/container/name': '"c1"',
            'k8s.io/namespace/name': '"default"',
            'k8s.io/pod/name': '"pod-xyz-123"',
        };
        assert.strictEqual(resource.type, 'k8s.io/container');
        assert.strictEqual(Object.keys(actualLabels).length, 3);
        assert.deepStrictEqual(actualLabels, expectedLabels);
    });
});
describe('mergeResources()', () => {
    const DEFAULT_RESOURCE = { type: null, labels: {} };
    const DEFAULT_RESOURCE_1 = {
        type: 'default',
        labels: { a: '100' },
    };
    const RESOURCE_1 = { type: 't1', labels: { a: '1', b: '2' } };
    const RESOURCE_2 = {
        type: 't2',
        labels: { a: '1', b: '3', c: '4' },
    };
    it('merge resources with default, resource1', () => {
        const resources = [DEFAULT_RESOURCE, RESOURCE_1];
        const resource = resource_1.CoreResource.mergeResources(resources);
        const expectedLabels = { a: '1', b: '2' };
        assert.strictEqual(resource.type, 't1');
        assert.strictEqual(Object.keys(resource.labels).length, 2);
        assert.deepStrictEqual(resource.labels, expectedLabels);
    });
    it('merge resources with default, resource1, resource2 = empty', () => {
        const resources = [
            DEFAULT_RESOURCE,
            RESOURCE_1,
            { type: null, labels: {} },
        ];
        const resource = resource_1.CoreResource.mergeResources(resources);
        const expectedLabels = { a: '1', b: '2' };
        assert.strictEqual(resource.type, 't1');
        assert.strictEqual(Object.keys(resource.labels).length, 2);
        assert.deepStrictEqual(resource.labels, expectedLabels);
    });
    it('merge resources with default, resource1 = empty, resource2', () => {
        const resources = [
            DEFAULT_RESOURCE,
            { type: null, labels: {} },
            RESOURCE_2,
        ];
        const resource = resource_1.CoreResource.mergeResources(resources);
        const expectedLabels = { a: '1', b: '3', c: '4' };
        assert.strictEqual(resource.type, 't2');
        assert.strictEqual(Object.keys(resource.labels).length, 3);
        assert.deepStrictEqual(resource.labels, expectedLabels);
    });
    it('merge resources with default1, resource1, resource2', () => {
        const resources = [DEFAULT_RESOURCE_1, RESOURCE_1, RESOURCE_2];
        const resource = resource_1.CoreResource.mergeResources(resources);
        const expectedLabels = { a: '100', b: '2', c: '4' };
        assert.strictEqual(resource.type, 'default');
        assert.strictEqual(Object.keys(resource.labels).length, 3);
        assert.deepStrictEqual(resource.labels, expectedLabels);
    });
});
//# sourceMappingURL=test-resource.js.map