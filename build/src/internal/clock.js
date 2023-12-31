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
exports.Clock = void 0;
/**
 * The Clock class is used to record the duration and endTime for spans.
 */
class Clock {
    /** Constructs a new Clock instance. */
    constructor(startTime) {
        /** Indicates if the clock is endend. */
        this.endedLocal = false;
        /** The duration between start and end of the clock. */
        this.diff = [0, 0];
        // In some cases clocks need to be relative to other resources, passing a
        // startTime makes it possible.
        this.startTimeLocal = startTime || new Date();
        this.hrtimeLocal = process.hrtime();
    }
    /** Ends the clock. */
    end() {
        if (this.endedLocal) {
            return;
        }
        this.diff = process.hrtime(this.hrtimeLocal);
        this.endedLocal = true;
    }
    /** Gets the current date from ellapsed milliseconds and start time. */
    get currentDate() {
        const diff = process.hrtime(this.hrtimeLocal);
        const ns = diff[0] * 1e9 + diff[1];
        const ellapsed = ns / 1e6;
        return new Date(this.startTime.getTime() + ellapsed);
    }
    /** Gets the duration of the clock. */
    get duration() {
        if (!this.endedLocal) {
            return 0;
        }
        const ns = this.diff[0] * 1e9 + this.diff[1];
        return ns / 1e6;
    }
    /** Starts the clock. */
    get startTime() {
        return this.startTimeLocal;
    }
    /**
     * Gets the time so far.
     * @returns A Date object with the current duration.
     */
    get endTime() {
        if (this.ended) {
            return new Date(this.startTime.getTime() + this.duration);
        }
        return new Date();
    }
    /** Indicates if the clock was ended. */
    get ended() {
        return this.endedLocal;
    }
}
exports.Clock = Clock;
//# sourceMappingURL=clock.js.map