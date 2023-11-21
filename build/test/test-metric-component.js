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
const metric_component_1 = require("../src/metrics/metric-component");
const metric_registry_1 = require("../src/metrics/metric-registry");
describe('MetricsComponent()', () => {
    let metricsComponent;
    beforeEach(() => {
        metric_producer_manager_1.metricProducerManagerInstance.removeAll();
        metricsComponent = new metric_component_1.MetricsComponent();
    });
    it('should return a MetricRegistry instance', () => {
        assert.ok(metricsComponent.getMetricRegistry() instanceof metric_registry_1.MetricRegistry);
    });
    it('should register metricRegistry to MetricProducerManger', () => {
        assert.strictEqual(metric_producer_manager_1.metricProducerManagerInstance.getAllMetricProducer().size, 1);
        assert.ok(metric_producer_manager_1.metricProducerManagerInstance
            .getAllMetricProducer()
            .has(metricsComponent.getMetricRegistry().getMetricProducer()));
    });
});
//# sourceMappingURL=test-metric-component.js.map