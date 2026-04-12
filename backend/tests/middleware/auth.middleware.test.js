const authMiddleware = require('../../src/middleware/auth.middleware');
const jwt = require('jsonwebtoken');


jest.mock('jsonwebtoken');

describe('Auth Middleware - Biztonsági Logika', () => {
    let req, res, next;

    beforeEach(() => {
        
        req = {
            headers: {},
            cookies: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test_secret';
        jest.clearAllMocks();
    });

    describe('verifyToken', () => {
        it('403-at kell adnia, ha nincs token sem sütiben, sem headerben', () => {
            authMiddleware.verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'no token provided' });
            expect(next).not.toHaveBeenCalled();
        });

        it('tovább kell engednie (next), ha a Bearer token érvényes', () => {
            req.headers['authorization'] = 'Bearer valid_token';
            const mockUser = { id: 1, name: 'Test User' };
            jwt.verify.mockReturnValue(mockUser);

            authMiddleware.verifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('401-et kell adnia, ha a token lejárt vagy hibás', () => {
            req.headers['authorization'] = 'Bearer expired_token';
            jwt.verify.mockImplementation(() => {
                throw new Error('jwt expired');
            });

            authMiddleware.verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'unauthorized' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('verifyAdmin', () => {
        it('401-et kell adnia, ha nincs req.user (elfelejtett verifyToken)', () => {
            authMiddleware.verifyAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('login required') }));
        });

        it('401-et kell adnia, ha a felhasználó nem admin (is_admin: false)', () => {
            req.user = { id: 1, is_admin: false };

            authMiddleware.verifyAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('admin access required') }));
        });

        it('tovább kell engednie, ha a felhasználó admin', () => {
            req.user = { id: 1, is_admin: true };

            authMiddleware.verifyAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});