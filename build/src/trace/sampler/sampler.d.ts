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
import { TraceParams } from '../config/types';
import { Sampler } from './types';
/**  Sampler that samples every trace. */
export declare class AlwaysSampler implements Sampler {
    readonly description = "always";
    shouldSample(traceId: string): boolean;
}
/** Sampler that samples no traces. */
export declare class NeverSampler implements Sampler {
    readonly description = "never";
    shouldSample(traceId: string): boolean;
}
/** Sampler that samples a given fraction of traces. */
export declare class ProbabilitySampler implements Sampler {
    private idUpperBound;
    readonly description: string;
    /**
     * Constructs a new Probability Sampler instance.
     */
    constructor(probability: number);
    /**
     * Checks if trace belong the sample.
     * @param traceId Used to check the probability
     * @returns a boolean. True if the traceId is in probability
     * False if the traceId is not in probability.
     */
    shouldSample(traceId: string): boolean;
}
/** Builder class of Samplers */
export declare class SamplerBuilder {
    private static readonly ALWAYS;
    private static readonly NEVER;
    /**
     * If probability parameter is bigger then 1 return AlwaysSampler instance.
     * If probability parameter is less than 0 returns NeverSampler instance.
     * Else returns a Probability Sampler
     *
     * @param probability probability between 0 and 1
     * @returns a Sampler object
     */
    static getSampler(probability: number): Sampler;
}
/**
 * The default sampler is a Probability sampler with the probability set to
 * 1/10000.
 */
export declare const DEFAULT_SAMPLING_RATE = 0.0001;
/** Default Limit for Annotations per span */
export declare const DEFAULT_SPAN_MAX_NUM_ANNOTATIONS = 32;
/** Default limit for Message events per span */
export declare const DEFAULT_SPAN_MAX_NUM_MESSAGE_EVENTS = 128;
/** Default limit for Attributes per span */
export declare const DEFAULT_SPAN_MAX_NUM_ATTRIBUTES = 32;
/** Default limit for Links per span */
export declare const DEFAULT_SPAN_MAX_NUM_LINKS = 32;
/** Builder Class of TraceParams */
export declare class TraceParamsBuilder {
    static getNumberOfAnnotationEventsPerSpan(traceParameters: TraceParams): number;
    static getNumberOfAttributesPerSpan(traceParameters: TraceParams): number;
    static getNumberOfMessageEventsPerSpan(traceParameters: TraceParams): number;
    static getNumberOfLinksPerSpan(traceParameters: TraceParams): number;
}
