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
const binary_serializer_1 = require("../src/tags/propagation/binary-serializer");
const tag_map_1 = require("../src/tags/tag-map");
const K1 = {
    name: 'k1',
};
const K2 = {
    name: 'k2',
};
const K3 = {
    name: 'k3',
};
const K4 = {
    name: 'k4',
};
const V1 = {
    value: 'v1',
};
const V2 = {
    value: 'v2',
};
const V3 = {
    value: 'v3',
};
const V4 = {
    value: 'v4',
};
describe('Binary Format Serializer', () => {
    const emptyTagMap = new tag_map_1.TagMap();
    const singleTagMap = new tag_map_1.TagMap();
    singleTagMap.set(K1, V1);
    const multipleTagMap = new tag_map_1.TagMap();
    multipleTagMap.set(K1, V1);
    multipleTagMap.set(K2, V2);
    multipleTagMap.set(K3, V3);
    multipleTagMap.set(K4, V4);
    describe('serializeBinary', () => {
        it('should serialize empty tag map', () => {
            const binary = binary_serializer_1.serializeBinary(emptyTagMap);
            assert.deepStrictEqual(binary_serializer_1.deserializeBinary(binary), emptyTagMap);
        });
        it('should serialize with one tag map', () => {
            const binary = binary_serializer_1.serializeBinary(singleTagMap);
            assert.deepStrictEqual(binary_serializer_1.deserializeBinary(binary), singleTagMap);
        });
        it('should serialize with multiple tag', () => {
            const binary = binary_serializer_1.serializeBinary(multipleTagMap);
            assert.deepStrictEqual(binary_serializer_1.deserializeBinary(binary), multipleTagMap);
        });
        it('should throw an error when exceeds the max serialized size', () => {
            const tags = new tag_map_1.TagMap();
            for (let i = 0; i < binary_serializer_1.TAG_MAP_SERIALIZED_SIZE_LIMIT / 8 - 1; i++) {
                // Each tag will be with format {key : "0123", value : "0123"}, so the
                // length of it is 8.
                const pad = '0000'.substring(0, 4 - `${i}`.length);
                const str = `${pad}${i}`;
                tags.set({ name: str }, { value: str });
            }
            // The last tag will be of size 9, so the total size of the TagMap
            // (8193) will be one byte more than limit.
            tags.set({ name: 'last' }, { value: 'last1' });
            assert.throws(() => {
                binary_serializer_1.serializeBinary(tags);
            }, /^Error: Size of TagMap exceeds the maximum serialized size 8192/);
        });
    });
    describe('deserializeBinary', () => {
        it('should throw an error when invalid tagKey', () => {
            const buff = Buffer.from([
                0x01,
                0x00,
                0x02,
                0x6b,
                0x31,
                0x02,
                0x76,
                0x31,
            ]);
            assert.throws(() => {
                binary_serializer_1.deserializeBinary(buff);
            }, /^Error: Wrong Version ID: 1. Currently supports version up to: 0/);
        });
        it('should stop parsing at first unknown field ID', () => {
            const expectedTags = new tag_map_1.TagMap();
            expectedTags.set(K1, V1);
            const buff = Buffer.from([
                0x00,
                0x00,
                0x02,
                0x6b,
                0x31,
                0x02,
                0x76,
                0x31,
                0x01,
                0x02,
                0x6b,
                0x32,
                0x02,
                0x76,
                0x32,
            ]);
            const tags = binary_serializer_1.deserializeBinary(buff);
            assert.strictEqual(tags.tags.size, 1);
            assert.deepStrictEqual(tags, expectedTags);
        });
    });
});
//# sourceMappingURL=test-binary-serializer.js.map