const authMiddleware = require('../../src/middleware/auth.middleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware - Cookie kezelés', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}, 
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'cookie_secret';
        jest.clearAllMocks();
    });

    it('be kell engednie, ha a token csak a sütiben van benne', () => {
        
        req.cookies.token = 'valid_cookie_token';
        jwt.verify.mockReturnValue({ id: 1, name: 'Sütis Felhasználó' });

        authMiddleware.verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid_cookie_token', 'cookie_secret');
        expect(req.user.name).toBe('Sütis Felhasználó');
        expect(next).toHaveBeenCalled();
    });

    it('prioritást kell adnia a sütinek a headerrel szemben (vagy fordítva, kód szerint)', () => {
        
        
        
        req.cookies.token = 'token_from_cookie';
        req.headers['authorization'] = 'Bearer token_from_header';
        
        jwt.verify.mockReturnValue({ source: 'cookie' });

        authMiddleware.verifyToken(req, res, next);

        
        expect(jwt.verify).toHaveBeenCalledWith('token_from_cookie', 'cookie_secret');
        expect(next).toHaveBeenCalled();
    });

    it('403-at kell adnia, ha a süti üres és a header is hiányzik', () => {
        req.cookies.token = undefined;
        
        authMiddleware.verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});