"use strict";
/**
 * Copyright 2019, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 the "License";
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
const validation_1 = require("../src/tags/validation");
describe('isValidTagKey()', () => {
    it('should return true when tag key is valid', () => {
        const tagKey = { name: 'key1' };
        assert.ok(validation_1.isValidTagKey(tagKey));
    });
    it('should return false when tag key is 0 character long', () => {
        const tagKey = { name: '' };
        assert.strictEqual(validation_1.isValidTagKey(tagKey), false);
    });
    it('should return false when the tag key length is longer than 255 characters ', () => {
        const tagKey = { name: 'a'.repeat(256) };
        assert.strictEqual(validation_1.isValidTagKey(tagKey), false);
    });
});
describe('isValidTagValue()', () => {
    it('should return true when tag value is valid', () => {
        const tagValue = { value: 'value1' };
        assert.ok(validation_1.isValidTagValue(tagValue));
    });
    it('should not throw an error when tag value is 0 character long', () => {
        const tagValue = { value: '' };
        assert.ok(validation_1.isValidTagValue(tagValue));
    });
    it('should return false when the tag value length is longer than 255 characters ', () => {
        const tagValue = { value: 'a'.repeat(256) };
        assert.strictEqual(validation_1.isValidTagValue(tagValue), false);
    });
});
//# sourceMappingURL=test-validation.js.map