const authController = require('../../src/controllers/auth.controller');
const userService = require('../../src/services/user.service');


jest.mock('../../src/services/user.service');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    
    req = {
      body: {},
      user: { userId: 1, role: 'user' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('hibát kell dobnia (400), ha hiányzik az email vagy jelszó', async () => {
      req.body = { email: 'teszt@gmail.com' }; 

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'email and password are required' });
    });

    it('sikeres bejelentkezésnél sütit és 200-as státuszt kell küldenie', async () => {
      const mockUser = { id: 1, email: 'teszt@gmail.com' };
      const mockToken = 'kamu-token-123';
      
      req.body = { email: 'teszt@gmail.com', password: 'password123' };
      userService.loginUser.mockResolvedValue({ user: mockUser, token: mockToken });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('hibát kell adnia (401), ha érvénytelenek a hitelesítő adatok', async () => {
      req.body = { email: 'rossz@email.hu', password: 'rossz' };
      
      userService.loginUser.mockResolvedValue({ user: null, token: null });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'invalid credentials' });
    });
  });

  describe('logout', () => {
    it('törölnie kell a sütit és 200-as kódot adni', () => {
      authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});