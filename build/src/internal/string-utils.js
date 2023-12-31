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
exports.StringUtils = void 0;
/**
 * Internal utility methods for working with tag keys, tag values, and metric
 * names.
 */
class StringUtils {
    /**
     * Determines whether the String contains only printable characters.
     *
     * @param str The String to be validated.
     * @returns Whether the String contains only printable characters.
     */
    static isPrintableString(str) {
        for (let i = 0; i < str.length; i++) {
            const ch = str.charAt(i);
            if (!StringUtils.isPrintableChar(ch)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Determines whether the Character is printable.
     *
     * @param ch The Character to be validated.
     * @returns Whether the Character is printable.
     */
    static isPrintableChar(ch) {
        return ch >= ' ' && ch <= '~';
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=string-utils.js.map