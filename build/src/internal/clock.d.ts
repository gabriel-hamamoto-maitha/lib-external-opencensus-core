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
/**
 * The Clock class is used to record the duration and endTime for spans.
 */
export declare class Clock {
    /** Indicates if the clock is endend. */
    private endedLocal;
    /** Indicates the clock's start time. */
    private startTimeLocal;
    /** The time in high resolution in a [seconds, nanoseconds]. */
    private hrtimeLocal;
    /** The duration between start and end of the clock. */
    private diff;
    /** Constructs a new Clock instance. */
    constructor(startTime?: Date);
    /** Ends the clock. */
    end(): void;
    /** Gets the current date from ellapsed milliseconds and start time. */
    get currentDate(): Date;
    /** Gets the duration of the clock. */
    get duration(): number;
    /** Starts the clock. */
    get startTime(): Date;
    /**
     * Gets the time so far.
     * @returns A Date object with the current duration.
     */
    get endTime(): Date;
    /** Indicates if the clock was ended. */
    get ended(): boolean;
}
