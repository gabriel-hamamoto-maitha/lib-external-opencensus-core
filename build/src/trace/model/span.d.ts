import { Logger } from '../../common/types';
import * as configTypes from '../config/types';
import * as types from './types';
/** Defines a base model for spans. */
export declare class Span implements types.Span {
    protected className: string;
    /** The clock used to mesure the beginning and ending of a span */
    private clock;
    /** Indicates if this span was started */
    private startedLocal;
    /** Indicates if this span was ended */
    private endedLocal;
    /** A list of child spans which are immediate, local children of this span */
    private spansLocal;
    /** The Span ID of this span */
    readonly id: string;
    /** A tracer object */
    readonly tracer: types.TracerBase;
    /** An object to log information to */
    logger: Logger;
    /** A set of attributes, each in the format [KEY]:[VALUE] */
    attributes: types.Attributes;
    /** A text annotation with a set of attributes. */
    annotations: types.Annotation[];
    /** An event describing a message sent/received between Spans */
    messageEvents: types.MessageEvent[];
    /** Pointers from the current span to another span */
    links: types.Link[];
    /** If the parent span is in another process. */
    remoteParent: boolean;
    /** This span's root span.  If it's a root span, it will point to this */
    root: Span;
    /** This span's parent. If it's a root span, must be empty */
    parentSpan?: Span;
    /** The resource name of the span */
    name: string;
    /** Kind of span. */
    kind: types.SpanKind;
    /** A final status for this span */
    status: types.Status;
    /** Trace Parameters */
    activeTraceParams: configTypes.TraceParams;
    /** The number of dropped attributes. */
    droppedAttributesCount: number;
    /** The number of dropped links. */
    droppedLinksCount: number;
    /** The number of dropped annotations. */
    droppedAnnotationsCount: number;
    /** The number of dropped message events. */
    droppedMessageEventsCount: number;
    /** Constructs a new Span instance. */
    constructor(tracer: types.TracerBase, parent?: Span);
    /** Returns whether a span is root or not. */
    isRootSpan(): boolean;
    /** Gets the trace ID. */
    get traceId(): string;
    /** Gets the trace state */
    get traceState(): types.TraceState | undefined;
    /**
     * Gets the ID of the parent span.
     * RootSpan doesn't have a parentSpan but it override this method.
     */
    get parentSpanId(): string;
    /** Indicates if span was started. */
    get started(): boolean;
    /** Indicates if span was ended. */
    get ended(): boolean;
    /**
     * Gives a timestamp that indicates the span's start time in RFC3339 UTC
     * "Zulu" format.
     */
    get startTime(): Date;
    /** Recursively gets the descendant spans. */
    allDescendants(): types.Span[];
    /** The list of immediate child spans. */
    get spans(): types.Span[];
    /** The number of direct children. */
    get numberOfChildren(): number;
    /**
     * Gives a timestamp that indicates the span's end time in RFC3339 UTC
     * "Zulu" format.
     */
    get endTime(): Date;
    /**
     * Gets the duration of the clock.
     */
    get duration(): number;
    /** Gives the TraceContext of the span. */
    get spanContext(): types.SpanContext;
    /**
     * Adds an atribute to the span.
     * @param key Describes the value added.
     * @param value The result of an operation. If the value is a typeof object
     *     it has to be JSON.stringify-able, cannot contain circular dependencies.
     */
    addAttribute(key: string, value: string | number | boolean | object): void;
    /**
     * Adds an annotation to the span.
     * @param description Describes the event.
     * @param attributes A set of attributes on the annotation.
     * @param timestamp A time, in milliseconds. Defaults to Date.now()
     */
    addAnnotation(description: string, attributes?: types.Attributes, timestamp?: number): void;
    /**
     * Adds a link to the span.
     * @param traceId The trace ID for a trace within a project.
     * @param spanId The span ID for a span within a trace.
     * @param type The relationship of the current span relative to the linked.
     * @param attributes A set of attributes on the link.
     */
    addLink(traceId: string, spanId: string, type: types.LinkType, attributes?: types.Attributes): void;
    /**
     * Adds a message event to the span.
     * @param type The type of message event.
     * @param id An identifier for the message event.
     * @param timestamp A time in milliseconds. Defaults to Date.now()
     * @param uncompressedSize The number of uncompressed bytes sent or received
     * @param compressedSize The number of compressed bytes sent or received. If
     *     zero or undefined, assumed to be the same size as uncompressed.
     */
    addMessageEvent(type: types.MessageEventType, id: number, timestamp?: number, uncompressedSize?: number, compressedSize?: number): void;
    /**
     * Sets a status to the span.
     * @param code The canonical status code.
     * @param message optional A developer-facing error message.
     */
    setStatus(code: types.CanonicalCode, message?: string): void;
    /** Starts the span. */
    start(): void;
    /** Ends the span and all of its children, recursively. */
    end(): void;
    /** Forces the span to end. */
    truncate(): void;
    /**
     * Starts a new child span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options?: types.SpanOptions): types.Span;
}
