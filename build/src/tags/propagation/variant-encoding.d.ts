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
/// <reference types="node" />
/**
 * Encodes a number in a variable-length encoding, 7 bits per byte.
 * @param value The input number.
 */
export declare function EncodeVarint(value: number): number[];
/**
 * Decodes a varint from buffer.
 * @param buffer The source buffer.
 * @param offset The offset within buffer.
 */
export declare function DecodeVarint(buffer: Buffer, offset: number): number;
