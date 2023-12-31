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
exports.noopPropagation = void 0;
const crypto = require("crypto");
const uuid = require("uuid");
/** No-op implementation of Propagation */
class NoopPropagation {
    extract(getter) {
        return null;
    }
    inject(setter, spanContext) { }
    generate() {
        return {
            traceId: uuid
                .v4()
                .split('-')
                .join(''),
            spanId: crypto.randomBytes(8).toString('hex'),
        };
    }
}
exports.noopPropagation = new NoopPropagation();
//# sourceMappingURL=noop-propagation.js.map