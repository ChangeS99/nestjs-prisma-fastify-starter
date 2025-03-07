declare module 'dd-trace' {
    interface TracerOptions {
        service?: string;
        env?: string;
        logInjection?: boolean;
        [key: string]: any;
    }

    interface Tracer {
        init(options?: TracerOptions): Tracer;
        use(plugin: string, options?: any): Tracer;
    }

    const tracer: Tracer;
    export default tracer;
} 