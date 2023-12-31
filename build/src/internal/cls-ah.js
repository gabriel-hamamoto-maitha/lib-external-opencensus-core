"use strict";
/**
 * Copyright 2018 Google LLC
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
exports.reset = exports.getNamespace = exports.destroyNamespace = exports.createNamespace = void 0;
// Original file from Stackdriver Trace Agent for Node.js
// https://github.com/GoogleCloudPlatform/cloud-trace-nodejs
const asyncHook = require("async_hooks");
const shimmer = require("shimmer");
const WRAPPED = Symbol('context_wrapped');
/** A map of AsyncResource IDs to Context objects. */
let contexts = new Map();
let current = {};
// Create the hook.
asyncHook.createHook({ init, before, destroy }).enable();
// A list of well-known EventEmitter methods that add event listeners.
const EVENT_EMITTER_METHODS = [
    'addListener',
    'on',
    'once',
    'prependListener',
    'prependOnceListener',
];
class AsyncHooksNamespace {
    get name() {
        throw new Error('Not implemented');
    }
    get active() {
        return current;
    }
    createContext() {
        throw new Error('Not implemented');
    }
    get(k) {
        return current[k];
    }
    set(k, v) {
        current[k] = v;
        return v;
    }
    run(fn) {
        this.runAndReturn(fn);
        return current;
    }
    runAndReturn(fn) {
        const oldContext = current;
        current = {};
        if (oldContext['current_tag_map']) {
            current['current_tag_map'] = oldContext['current_tag_map'];
        }
        const res = fn();
        current = oldContext;
        return res;
    }
    bind(cb) {
        // TODO(kjin): Monitor https://github.com/Microsoft/TypeScript/pull/15473.
        // When it's landed and released, we can remove these `any` casts.
        // tslint:disable-next-line:no-any
        if (cb[WRAPPED] || !current) {
            return cb;
        }
        const boundContext = current;
        const contextWrapper = function () {
            const oldContext = current;
            current = boundContext;
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'IArguments' is not assignable to... Remove this comment to see the full error message
            const res = cb.apply(this, arguments);
            current = oldContext;
            return res;
        };
        // tslint:disable-next-line:no-any
        contextWrapper[WRAPPED] = true;
        Object.defineProperty(contextWrapper, 'length', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: cb.length,
        });
        return contextWrapper;
    }
    // This function is not technically needed and all tests currently pass
    // without it (after removing call sites). While it is not a complete
    // solution, restoring correct context before running every request/response
    // event handler reduces the number of situations in which userspace queuing
    // will cause us to lose context.
    bindEmitter(ee) {
        const ns = this;
        EVENT_EMITTER_METHODS.forEach(method => {
            if (ee[method]) {
                shimmer.wrap(ee, method, oldMethod => {
                    return function (event, cb) {
                        // @ts-expect-error ts-migrate(2684) FIXME: The 'this' context of type '((event: string | symb... Remove this comment to see the full error message
                        return oldMethod.call(this, event, ns.bind(cb));
                    };
                });
            }
        });
    }
}
const namespace = new AsyncHooksNamespace();
// AsyncWrap Hooks
/** init is called during object construction. */
function init(uid, provider, parentUid, parentHandle) {
    contexts.set(uid, current);
}
/** before is called just before the resource's callback is called. */
function before(uid) {
    const maybeCurrent = contexts.get(uid);
    if (maybeCurrent !== undefined) {
        current = maybeCurrent;
    }
}
/**
 * destroy is called when the object is no longer used, so also delete
 * its entry in the map.
 */
function destroy(uid) {
    contexts.delete(uid);
}
function createNamespace() {
    return namespace;
}
exports.createNamespace = createNamespace;
function destroyNamespace() {
    current = {};
    contexts = new Map();
}
exports.destroyNamespace = destroyNamespace;
function getNamespace() {
    return namespace;
}
exports.getNamespace = getNamespace;
function reset() {
    throw new Error('Not implemented');
}
exports.reset = reset;
//# sourceMappingURL=cls-ah.js.map