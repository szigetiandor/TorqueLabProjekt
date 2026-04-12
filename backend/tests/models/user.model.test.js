const userModel = require('../../src/models/user.model');
const { getPool } = require('../../src/database');

jest.mock('../../src/database');

describe('User Model', () => {
  let mockRequest;
  let mockPool;

  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };
    mockPool = { request: jest.fn(() => mockRequest) };
    getPool.mockResolvedValue(mockPool);
    jest.clearAllMocks();
  });

  describe('User Class & toJSON', () => {
    it('a toJSON metódusnak el kell távolítania a password_hash-t', () => {
      const user = new userModel.User({
        user_id: 1,
        name: 'Teszt',
        password_hash: 'secret_hash'
      });

      const json = JSON.parse(JSON.stringify(user));
      expect(json._password_hash).toBeUndefined();
      expect(json.name).toBe('Teszt');
    });
  });

  describe('findByEmail', () => {
    it('visszaadja a felhasználót email alapján', async () => {
      const mockUser = { user_id: 1, email: 'test@test.hu', name: 'Teszt' };
      mockRequest.query.mockResolvedValue({ recordset: [mockUser] });

      const result = await userModel.findByEmail('test@test.hu');

      expect(mockRequest.input).toHaveBeenCalledWith('email', 'test@test.hu');
      expect(result.name).toBe('Teszt');
    });
  });

  describe('makeAdmin', () => {
    it('sikeresen adminná léptet elő egy felhasználót', async () => {
      const adminUser = { user_id: 1, is_admin: 1 };
      mockRequest.query.mockResolvedValue({ recordset: [adminUser] });

      const result = await userModel.makeAdmin(1);

      expect(result.is_admin).toBe(1);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SET is_admin=1"));
    });
  });

  describe('create', () => {
    it('helyesen kezeli a [user] táblanevet szögletes zárójelben', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [{ user_id: 1 }] });
      
      await userModel.create({ name: 'A', email: 'B', _password_hash: 'C', is_admin: 0 });

      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO [user]"));
    });
  });
});