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
exports.CoreResource = void 0;
const string_utils_1 = require("../internal/string-utils");
/**
 * Resource represents a resource, which capture identifying information about
 * the entities for which signals (stats or traces) are reported. It further
 * provides a framework for detection of resource information from the
 * environment and progressive population as signals propagate from the core
 * instrumentation library to a backend's exporter.
 */
class CoreResource {
    /**
     * Returns a Resource. This resource information is loaded from the
     * OC_RESOURCE_TYPE and OC_RESOURCE_LABELS environment variables.
     *
     * @returns The resource.
     */
    static createFromEnvironmentVariables() {
        return { type: CoreResource.ENV_TYPE, labels: CoreResource.ENV_LABEL_MAP };
    }
    /**
     * Returns a Resource that runs all input resources sequentially and merges
     * their results. In case a type of label key is already set, the first set
     * value takes precedence.
     *
     * @param resources The list of the resources.
     * @returns The resource.
     */
    static mergeResources(resources) {
        if (resources.length === 0)
            return { type: 'global', labels: {} };
        let currentResource = resources[0];
        for (let i = 1; i < resources.length; i++) {
            currentResource = this.merge(currentResource, resources[i]);
        }
        return currentResource;
    }
    /**
     * Creates a resource type from the OC_RESOURCE_TYPE environment variable.
     *
     * OC_RESOURCE_TYPE: A string that describes the type of the resource
     * prefixed by a domain namespace, e.g. “kubernetes.io/container”.
     *
     * @param rawEnvType The resource type.
     * @returns The sanitized resource type.
     */
    static parseResourceType(rawEnvType) {
        if (!rawEnvType)
            return null;
        if (!CoreResource.isValidAndNotEmpty(rawEnvType)) {
            throw new Error(`Type ${CoreResource.ERROR_MESSAGE_INVALID_CHARS}`);
        }
        return rawEnvType.trim();
    }
    /**
     * Creates a label map from the OC_RESOURCE_LABELS environment variable.
     *
     * OC_RESOURCE_LABELS: A comma-separated list of labels describing the
     * source in more detail, e.g. “key1=val1,key2=val2”. Domain names and paths
     * are accepted as label keys. Values may be quoted or unquoted in general. If
     * a value contains whitespaces, =, or " characters, it must always be quoted.
     *
     * @param rawEnvLabels The resource labels as a comma-seperated list
     * of key/value pairs.
     * @returns The sanitized resource labels.
     */
    static parseResourceLabels(rawEnvLabels) {
        if (!rawEnvLabels)
            return {};
        const labels = {};
        const rawLabels = rawEnvLabels.split(this.COMMA_SEPARATOR, -1);
        for (const rawLabel of rawLabels) {
            const keyValuePair = rawLabel.split(this.LABEL_KEY_VALUE_SPLITTER, -1);
            if (keyValuePair.length !== 2) {
                continue;
            }
            let [key, value] = keyValuePair;
            // Leading and trailing whitespaces are trimmed.
            key = key.trim();
            value = value
                .trim()
                .split('^"|"$')
                .join('');
            if (!CoreResource.isValidAndNotEmpty(key)) {
                throw new Error(`Label key ${CoreResource.ERROR_MESSAGE_INVALID_CHARS}`);
            }
            if (!CoreResource.isValid(value)) {
                throw new Error(`Label value ${CoreResource.ERROR_MESSAGE_INVALID_VALUE}`);
            }
            labels[key] = value;
        }
        return labels;
    }
    /**
     * Returns a new, merged Resource by merging two resources. In case of
     * a collision, first resource takes precedence.
     *
     * @param resource The resource object.
     * @param otherResource The resource object.
     * @returns A new, merged Resource.
     */
    static merge(resource, otherResource) {
        if (!resource) {
            return otherResource;
        }
        if (!otherResource) {
            return resource;
        }
        return {
            type: resource.type || otherResource.type,
            labels: Object.assign({}, otherResource.labels, resource.labels),
        };
    }
    /**
     * Determines whether the given String is a valid printable ASCII string with
     * a length not exceed MAX_LENGTH characters.
     *
     * @param str The String to be validated.
     * @returns Whether the String is valid.
     */
    static isValid(name) {
        return (name.length <= CoreResource.MAX_LENGTH &&
            string_utils_1.StringUtils.isPrintableString(name));
    }
    /**
     * Determines whether the given String is a valid printable ASCII string with
     * a length greater than 0 and not exceed MAX_LENGTH characters.
     *
     * @param str The String to be validated.
     * @returns Whether the String is valid and not empty.
     */
    static isValidAndNotEmpty(name) {
        return name.length > 0 && CoreResource.isValid(name);
    }
    /** TEST_ONLY */
    static setup() {
        CoreResource.ENV_TYPE = CoreResource.parseResourceType(process.env.OC_RESOURCE_TYPE);
        CoreResource.ENV_LABEL_MAP = CoreResource.parseResourceLabels(process.env.OC_RESOURCE_LABELS);
    }
}
exports.CoreResource = CoreResource;
// Type, label keys, and label values should not exceed 256 characters.
CoreResource.MAX_LENGTH = 255;
// OC_RESOURCE_LABELS is a comma-separated list of labels.
CoreResource.COMMA_SEPARATOR = ',';
// OC_RESOURCE_LABELS contains key value pair separated by '='.
CoreResource.LABEL_KEY_VALUE_SPLITTER = '=';
CoreResource.ENV_TYPE = CoreResource.parseResourceType(process.env.OC_RESOURCE_TYPE);
CoreResource.ENV_LABEL_MAP = CoreResource.parseResourceLabels(process.env.OC_RESOURCE_LABELS);
CoreResource.ERROR_MESSAGE_INVALID_CHARS = 'should be a ASCII string with a length greater than 0 and not exceed ' +
    CoreResource.MAX_LENGTH +
    ' characters.';
CoreResource.ERROR_MESSAGE_INVALID_VALUE = 'should be a ASCII string with a length not exceed ' +
    CoreResource.MAX_LENGTH +
    ' characters.';
//# sourceMappingURL=resource.js.map