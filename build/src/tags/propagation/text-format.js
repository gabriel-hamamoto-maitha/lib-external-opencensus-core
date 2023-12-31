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
exports.deserializeTextFormat = exports.serializeTextFormat = exports.MAX_NUMBER_OF_TAGS = void 0;
/**
 * This module contains the functions for serializing and deserializing
 * TagMap (TagContext) with W3C Correlation Context as the HTTP text format.
 * It allows tags to propagate across requests.
 *
 * OpenCensus uses W3C Correlation Context as the HTTP text format.
 * https://github.com/w3c/correlation-context/blob/master/correlation_context/HTTP_HEADER_FORMAT.md
 */
const tag_map_1 = require("../tag-map");
const types_1 = require("../types");
exports.MAX_NUMBER_OF_TAGS = 180;
const TAG_SERIALIZED_SIZE_LIMIT = 4096;
const TAGMAP_SERIALIZED_SIZE_LIMIT = 8192;
const TAG_KEY_VALUE_DELIMITER = '=';
const TAG_DELIMITER = ',';
const UNLIMITED_PROPAGATION_MD = {
    tagTtl: types_1.TagTtl.UNLIMITED_PROPAGATION,
};
/**
 * Serializes a given TagMap to the on-the-wire format based on the W3C HTTP
 * text format standard.
 * @param tagMap The TagMap to serialize.
 */
function serializeTextFormat(tagMap) {
    let ret = '';
    let totalChars = 0;
    let totalTags = 0;
    const tags = tagMap.tagsWithMetadata;
    tags.forEach((tagsWithMetadata, tagKey) => {
        if (tagsWithMetadata.tagMetadata.tagTtl !== types_1.TagTtl.NO_PROPAGATION) {
            if (ret.length > 0)
                ret += TAG_DELIMITER;
            totalChars += validateTag(tagKey, tagsWithMetadata.tagValue);
            ret +=
                tagKey.name + TAG_KEY_VALUE_DELIMITER + tagsWithMetadata.tagValue.value;
            totalTags++;
        }
    });
    if (totalTags > exports.MAX_NUMBER_OF_TAGS) {
        throw new Error(`Number of tags in the TagMap exceeds limit ${exports.MAX_NUMBER_OF_TAGS}`);
    }
    if (totalChars > TAGMAP_SERIALIZED_SIZE_LIMIT) {
        throw new Error(`Size of TagMap exceeds the maximum serialized size ${TAGMAP_SERIALIZED_SIZE_LIMIT}`);
    }
    return ret;
}
exports.serializeTextFormat = serializeTextFormat;
/**
 * Deserializes input to TagMap based on the W3C HTTP text format standard.
 * @param str The TagMap to deserialize.
 */
function deserializeTextFormat(str) {
    const tags = new tag_map_1.TagMap();
    if (!str)
        return tags;
    const listOfTags = str.split(TAG_DELIMITER);
    listOfTags.forEach(tag => {
        const keyValuePair = tag.split(TAG_KEY_VALUE_DELIMITER);
        if (keyValuePair.length !== 2)
            throw new Error(`Malformed tag ${tag}`);
        const [name, value] = keyValuePair;
        tags.set({ name }, { value }, UNLIMITED_PROPAGATION_MD);
    });
    return tags;
}
exports.deserializeTextFormat = deserializeTextFormat;
function validateTag(tagKey, tagValue) {
    const charsOfTag = tagKey.name.length + tagValue.value.length;
    if (charsOfTag > TAG_SERIALIZED_SIZE_LIMIT) {
        throw new Error(`Serialized size of tag exceeds limit ${TAG_SERIALIZED_SIZE_LIMIT}`);
    }
    return charsOfTag;
}
//# sourceMappingURL=text-format.js.map