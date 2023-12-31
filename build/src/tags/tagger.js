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
exports.clear = exports.withTagContext = exports.setCurrentTagContext = exports.getCurrentTagContext = exports.EMPTY_TAG_MAP = void 0;
const tag_map_1 = require("./tag-map");
exports.EMPTY_TAG_MAP = new tag_map_1.TagMap();
const CURRENT_TAG_MAP_KEY = 'current_tag_map';
/** Gets the current tag context. */
function getCurrentTagContext(contextManager) {
    const tagsFromContext = contextManager.get(CURRENT_TAG_MAP_KEY);
    if (tagsFromContext) {
        return makeDeepCopy(tagsFromContext);
    }
    return new tag_map_1.TagMap();
}
exports.getCurrentTagContext = getCurrentTagContext;
/**
 * Sets the current tag context.
 * @param tags The TagMap.
 */
function setCurrentTagContext(contextManager, tags) {
    contextManager.set(CURRENT_TAG_MAP_KEY, makeDeepCopy(tags));
}
exports.setCurrentTagContext = setCurrentTagContext;
/**
 * Enters the scope of code where the given `TagMap` is in the current context
 * (replacing the previous `TagMap`).
 * @param tags The TagMap to be set to the current context.
 * @param fn Callback function.
 * @returns The callback return.
 */
function withTagContext(contextManager, tags, fn) {
    const oldContext = getCurrentTagContext(contextManager);
    return contextManager.runAndReturn(() => {
        const newContext = new tag_map_1.TagMap();
        for (const [tagKey, tagValue] of oldContext.tags) {
            newContext.set(tagKey, tagValue);
        }
        for (const [tagKey, tagValue] of tags.tags) {
            newContext.set(tagKey, tagValue);
        }
        setCurrentTagContext(contextManager, newContext);
        return fn();
    });
}
exports.withTagContext = withTagContext;
/** Clear the current tag context. */
function clear(contextManager) {
    contextManager.set(CURRENT_TAG_MAP_KEY, new tag_map_1.TagMap());
}
exports.clear = clear;
function makeDeepCopy(tags) {
    const tagsCopy = new tag_map_1.TagMap();
    for (const [tagKey, valueWithMetadata] of tags.tagsWithMetadata) {
        tagsCopy.set(tagKey, valueWithMetadata.tagValue, valueWithMetadata.tagMetadata);
    }
    return tagsCopy;
}
//# sourceMappingURL=tagger.js.map