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
const assert = require("assert");
const metric_producer_manager_1 = require("../src/metrics/export/metric-producer-manager");
const metric_registry_1 = require("../src/metrics/metric-registry");
describe('MetricProducerManager()', () => {
    const registry = new metric_registry_1.MetricRegistry();
    const metricProducer = registry.getMetricProducer();
    const registryOther = new metric_registry_1.MetricRegistry();
    const metricProducerOther = registryOther.getMetricProducer();
    beforeEach(() => {
        metric_producer_manager_1.metricProducerManagerInstance.removeAll();
    });
    describe('add()', () => {
        it('add metricproducer', () => {
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            const metricProducerList = metric_producer_manager_1.metricProducerManagerInstance.getAllMetricProducer();
            assert.notStrictEqual(metricProducerList, null);
            assert.strictEqual(metricProducerList.size, 1);
        });
        it('should not add same metricproducer metricProducerManagerInstance', () => {
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            const metricProducerList = metric_producer_manager_1.metricProducerManagerInstance.getAllMetricProducer();
            assert.strictEqual(metricProducerList.size, 1);
            assert.ok(metricProducerList.has(metricProducer));
        });
        it('should add different metricproducer metricProducerManagerInstance', () => {
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducerOther);
            const metricProducerList = metric_producer_manager_1.metricProducerManagerInstance.getAllMetricProducer();
            assert.strictEqual(metricProducerList.size, 2);
            assert.ok(metricProducerList.has(metricProducer));
            assert.ok(metricProducerList.has(metricProducerOther));
        });
    });
    describe('remove()', () => {
        it('remove metricproducer', () => {
            metric_producer_manager_1.metricProducerManagerInstance.add(metricProducer);
            const metricProducerList = metric_producer_manager_1.metricProducerManagerInstance.getAllMetricProducer();
            assert.strictEqual(metricProducerList.size, 1);
            assert.ok(metricProducerList.has(metricProducer));
            metric_producer_manager_1.metricProducerManagerInstance.remove(metricProducer);
            assert.strictEqual(metricProducerList.size, 0);
        });
    });
});
//# sourceMappingURL=test-metric-producer-manager.js.map