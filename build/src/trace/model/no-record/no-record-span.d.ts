import { Logger } from '../../../common/types';
import * as configTypes from '../../config/types';
import * as types from '../types';
/** Implementation for the SpanBase class that does not record trace events. */
export declare class NoRecordSpan implements types.Span {
    /** Indicates if this span was started */
    private startedLocal;
    /** Indicates if this span was ended */
    private endedLocal;
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
    root: NoRecordSpan;
    /** This span's parent. If it's a root span, must be empty */
    parentSpan?: NoRecordSpan;
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
    /** Constructs a new SpanBaseModel instance. */
    constructor(tracer: types.TracerBase, parent?: NoRecordSpan);
    /** Returns whether a span is root or not. */
    isRootSpan(): boolean;
    /** Gets trace id of no-record span. */
    get traceId(): string;
    /** Gets the trace state */
    get traceState(): types.TraceState | undefined;
    /** Gets the ID of the parent span. */
    get parentSpanId(): string;
    /** Indicates if span was started. */
    get started(): boolean;
    /** Indicates if span was ended. */
    get ended(): boolean;
    /** No-op implementation of this method. */
    get startTime(): Date;
    /** No-op implementation of this method. */
    allDescendants(): types.Span[];
    /** No-op implementation of this method. */
    get spans(): types.Span[];
    /** No-op implementation of this method. */
    get numberOfChildren(): number;
    /** No-op implementation of this method. */
    get endTime(): Date;
    /** Gives the TraceContext of the span. */
    get spanContext(): types.SpanContext;
    /** No-op implementation of this method. */
    get duration(): number;
    /** No-op implementation of this method. */
    addAttribute(key: string, value: string | number | boolean | object): void;
    /** No-op implementation of this method. */
    addAnnotation(description: string, attributes?: types.Attributes, timestamp?: number): void;
    /** No-op implementation of this method. */
    addLink(traceId: string, spanId: string, type: types.LinkType, attributes?: types.Attributes): void;
    /** No-op implementation of this method. */
    addMessageEvent(type: types.MessageEventType, id: number, timestamp?: number, uncompressedSize?: number, compressedSize?: number): void;
    /** No-op implementation of this method. */
    setStatus(code: types.CanonicalCode, message?: string): void;
    /** No-op implementation of this method. */
    start(): void;
    /** No-op implementation of this method. */
    end(): void;
    /** No-op implementation of this method. */
    truncate(): void;
    /**
     * Starts a new no record child span in the no record root span.
     * @param [options] A SpanOptions object to start a child span.
     */
    startChildSpan(options?: types.SpanOptions): types.Span;
}
