declare module 'passport-apple' {
    import { Strategy as PassportStrategy } from 'passport';

    export class Strategy extends PassportStrategy {
        constructor(options: any, verify: any);
        authenticate(req: any, options?: any): void;
    }
}
