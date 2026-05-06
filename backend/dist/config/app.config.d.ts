export declare const AppConfig: (() => {
    name: string;
    environment: string;
    port: number;
    host: string;
    postgres: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        poolSize: number;
    };
    mongodb: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
        ttl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    rateLimit: {
        ttl: number;
        max: number;
    };
    aiService: {
        url: string;
        confidenceThreshold: number;
        anomalyThreshold: number;
    };
    cors: {
        origins: string[];
    };
    logging: {
        level: string;
        format: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    name: string;
    environment: string;
    port: number;
    host: string;
    postgres: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        poolSize: number;
    };
    mongodb: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
        ttl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    rateLimit: {
        ttl: number;
        max: number;
    };
    aiService: {
        url: string;
        confidenceThreshold: number;
        anomalyThreshold: number;
    };
    cors: {
        origins: string[];
    };
    logging: {
        level: string;
        format: string;
    };
}>;
