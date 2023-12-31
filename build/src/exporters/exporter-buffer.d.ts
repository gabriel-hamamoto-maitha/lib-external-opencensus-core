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
import * as configTypes from '../trace/config/types';
import * as modelTypes from '../trace/model/types';
import * as types from './types';
/** Controls the sending of traces to exporters. */
export declare class ExporterBuffer {
    /** The service to send the collected spans. */
    private exporter;
    /** Maximum size of a buffer. */
    private bufferSize;
    /** Max time for a buffer can wait before being sent */
    private bufferTimeout;
    /** Manage when the buffer timeout needs to be reseted */
    private resetTimeout;
    /** Indicates when the buffer timeout is running */
    private bufferTimeoutInProgress;
    /** An object to log information to */
    private logger;
    /** Trace queue of a buffer */
    private queue;
    /**
     * Constructs a new Buffer instance.
     * @param exporter The service to send the collected spans.
     * @param config A buffer configuration object to create a buffer.
     */
    constructor(exporter: types.Exporter, config: configTypes.BufferConfig);
    /**
     * Set the buffer size value.
     * @param bufferSize The new buffer size.
     */
    setBufferSize(bufferSize: number): this;
    getBufferSize(): number;
    getQueue(): modelTypes.Span[];
    /**
     * Add a span in the buffer.
     * @param span Span to be added in the buffer.
     */
    addToBuffer(span: modelTypes.Span): this;
    /** Reset the buffer timeout */
    private resetBufferTimeout;
    /** Start the buffer timeout, when finished calls flush method */
    private setBufferTimeout;
    /** Send the trace queue to all exporters */
    private flush;
}
