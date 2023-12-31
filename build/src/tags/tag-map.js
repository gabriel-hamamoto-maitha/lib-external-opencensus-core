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
exports.TagMap = void 0;
const types_1 = require("./types");
const validation_1 = require("./validation");
const UNLIMITED_PROPAGATION_MD = {
    tagTtl: types_1.TagTtl.UNLIMITED_PROPAGATION,
};
/** TagMap is maps of TagKey -> TagValueWithMetadata */
class TagMap {
    constructor() {
        // A map mapping TagKey to to its respective TagValueWithMetadata.
        this.registeredTags = new Map();
    }
    /**
     * Adds the key/value pair regardless of whether the key is present.
     * @param tagKey The TagKey which will be set.
     * @param tagValue The TagValue to set for the given key.
     * @param tagMetadata The TagMetadata associated with this Tag.
     */
    set(tagKey, tagValue, tagMetadata) {
        if (!validation_1.isValidTagKey(tagKey) || !validation_1.isValidTagValue(tagValue))
            return;
        let existingKey;
        for (const key of this.registeredTags.keys()) {
            if (key.name === tagKey.name) {
                existingKey = key;
                break;
            }
        }
        if (existingKey)
            this.registeredTags.delete(existingKey);
        const valueWithMetadata = this.getValueWithMetadata(tagValue, tagMetadata);
        this.registeredTags.set(tagKey, valueWithMetadata);
    }
    /**
     * Deletes a tag from the map if the key is in the map.
     * @param tagKey The TagKey which will be removed.
     */
    delete(tagKey) {
        this.registeredTags.delete(tagKey);
    }
    /** Gets the tags map without metadata. */
    get tags() {
        const tagsWithoutMetadata = new Map();
        for (const [tagKey, valueWithMetadata] of this.registeredTags) {
            tagsWithoutMetadata.set(tagKey, valueWithMetadata.tagValue);
        }
        return tagsWithoutMetadata;
    }
    /** Gets the tags map with metadata. */
    get tagsWithMetadata() {
        return this.registeredTags;
    }
    /**
     * Constructs a new TagValueWithMetadata using tagValue and tagMetadata.
     * For backwards-compatibility this method still produces propagating Tags
     * (UNLIMITED_PROPAGATION) if tagMetadata is not provided or missing.
     */
    getValueWithMetadata(tagValue, tagMetadata) {
        if (tagMetadata) {
            return { tagValue, tagMetadata };
        }
        return { tagValue, tagMetadata: UNLIMITED_PROPAGATION_MD };
    }
}
exports.TagMap = TagMap;
//# sourceMappingURL=tag-map.js.map