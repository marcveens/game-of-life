export class Environment {
    public static get isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    public static get isDevelopment(): boolean {
        return (window.location.hostname.indexOf('localhost') > -1) || process.env.NODE_ENV === 'development';
    }

    public static get isTest(): boolean {
        return process.env.NODE_ENV === 'test';
    }
}