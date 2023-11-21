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
const tag_map_1 = require("../src/tags/tag-map");
const types_1 = require("../src/tags/types");
describe('TagMap()', () => {
    let tagMap;
    const key1 = { name: 'key1' };
    const key2 = { name: 'key2' };
    const invalidKey1 = { name: 'a'.repeat(256) };
    const value1 = { value: 'value1' };
    const value2 = { value: 'value2' };
    const invalidValue1 = { value: 'a'.repeat(256) };
    const NO_PROPAGATION_MD = { tagTtl: types_1.TagTtl.NO_PROPAGATION };
    const UNLIMITED_PROPAGATION_MD = { tagTtl: types_1.TagTtl.UNLIMITED_PROPAGATION };
    const expectedTagValueWithMetadata1 = {
        tagValue: { value: 'value1' },
        tagMetadata: { tagTtl: -1 },
    };
    const expectedTagValueWithMetadata2 = {
        tagValue: { value: 'value2' },
        tagMetadata: { tagTtl: -1 },
    };
    beforeEach(() => {
        tagMap = new tag_map_1.TagMap();
    });
    describe('set()', () => {
        it('should set tagkey and tagvalue with default TagMetadata', () => {
            tagMap.set(key1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata1);
        });
        it('should set tagkey and tagvalue with NO_PROPAGATION TagTtl', () => {
            const expectedTagValueWithMetadata = {
                tagValue: { value: 'value1' },
                tagMetadata: { tagTtl: 0 },
            };
            tagMap.set(key1, value1, NO_PROPAGATION_MD);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata);
        });
        it('should set tagkey and tagvalue with UNLIMITED_PROPAGATION TagTtl', () => {
            const expectedTagValueWithMetadata = {
                tagValue: { value: 'value1' },
                tagMetadata: { tagTtl: -1 },
            };
            tagMap.set(key1, value1, UNLIMITED_PROPAGATION_MD);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata);
        });
        it('should silently ignore when invalid tagKey', () => {
            tagMap.set(invalidKey1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 0);
        });
        it('should silently ignore when invalid tagValue', () => {
            tagMap.set(key1, invalidValue1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 0);
        });
        it('should not set duplicate tagkey and tagvalue', () => {
            tagMap.set(key1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata1);
            tagMap.set(key1, value1);
            assert.strictEqual(tags.size, 1);
        });
        it('should update existing tagkey', () => {
            tagMap.set(key1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata1);
            tagMap.set(key1, value2);
            assert.strictEqual(tags.size, 1);
            assert.deepStrictEqual(tags.get(key1), expectedTagValueWithMetadata2);
        });
    });
    describe('delete()', () => {
        it('should delete tagkey', () => {
            tagMap.set(key1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            tagMap.delete(key1);
            assert.strictEqual(tags.size, 0);
        });
        it('should delete missing tagkey1', () => {
            tagMap.set(key1, value1);
            const tags = tagMap.tagsWithMetadata;
            assert.strictEqual(tags.size, 1);
            tagMap.delete(key2);
            assert.strictEqual(tags.size, 1);
        });
    });
});
//# sourceMappingURL=test-tag-map.js.map