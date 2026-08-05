import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from './types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function generateToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string;
//# sourceMappingURL=middleware.d.ts.map