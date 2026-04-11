const userController = require('../../src/controllers/user.controller');
const userService = require('../../src/services/user.service');


jest.mock('../../src/services/user.service');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('400-as hibát ad, ha hiányzik a név, email vagy jelszó', async () => {
      req.body = { email: 'teszt@mail.com', password: 'password123' }; 

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
    });

    it('400-as hibát ad, ha a jelszó rövidebb, mint 10 karakter', async () => {
      req.body = { 
        name: 'Teszt Elek', 
        email: 'teszt@mail.com', 
        password: 'rövid' 
      };

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Password needs to be at least 10 characters" });
    });

    it('201-et ad és menti a felhasználót (is_admin kezeléssel)', async () => {
      const newUser = { name: 'Admin Jani', email: 'admin@tuning.hu', password: 'nagyonhosszujszo' };
      req.body = newUser;
      userService.createUser.mockResolvedValue({ id: 1, ...newUser, is_admin: false });

      await userController.createUser(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(expect.objectContaining({
        is_admin: false
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getAllUsers', () => {
    it('le kell kérnie az összes felhasználót 200-as kóddal', async () => {
      const mockUsers = [{ id: 1, name: 'User1' }, { id: 2, name: 'User2' }];
      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('404-et ad, ha a felhasználó nem létezik', async () => {
      req.params.id = '999';
      userService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe('updateUser', () => {
    it('sikeres frissítésnél visszaküldi a frissített objektumot', async () => {
      req.params.id = '1';
      const updateData = { name: 'Módosított Név' };
      req.body = updateData;
      userService.updateUser.mockResolvedValue({ id: 1, ...updateData });

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    it('500-at ad, ha a szerviz rétegben hiba történik', async () => {
        req.params.id = '1';
        userService.updateUser.mockRejectedValue(new Error("DB Hiba"));

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteUser', () => {
    it('sikeres törlésnél visszaigazoló üzenetet küld', async () => {
      req.params.id = '10';
      userService.deleteUser.mockResolvedValue(true);

      await userController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });
  });
});