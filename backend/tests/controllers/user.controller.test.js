const userController = require('../../src/controllers/user.controller');
const userService = require('../../src/services/user.service');

jest.mock('../../src/services/user.service');

describe('UserController Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        // Express req/res objektumok szimulálása minden teszt előtt
        req = {
            params: {},
            body: {},
            user: {} // Az authMiddleware által feltöltött adat
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    // --- CREATE USER TESZTEK ---
    describe('createUser', () => {
        test('Sikeres regisztráció (201)', async () => {
            req.body = { name: 'Teszt Elek', email: 't@e.hu', password: 'password123' };
            userService.createUser.mockResolvedValue({ id: 1, ...req.body });

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(userService.createUser).toHaveBeenCalled();
        });

        test('Edge Case: Rövid jelszó hiba (400)', async () => {
            req.body = { name: 'Teszt', email: 't@e.hu', password: '123' };
            
            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("min. 10 chars") });
        });
    });

    // --- GET USER BY ID TESZTEK (Access Control) ---
    describe('getUserById', () => {
        test('Saját profil lekérése engedélyezve (200)', async () => {
            req.params.id = '10';
            req.user = { user_id: '10', is_admin: false }; // 10-es kéri a 10-est
            userService.getUserById.mockResolvedValue({ id: '10', name: 'Teszt User' });

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        test('Admin lekérhet más felhasználót (200)', async () => {
            req.params.id = '99';
            req.user = { user_id: '1', is_admin: true }; // Admin kéri a 99-est
            userService.getUserById.mockResolvedValue({ id: '99' });

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('Biztonsági hiba: Más profiljának lekérése sima userként (403)', async () => {
            req.params.id = '99';
            req.user = { user_id: '10', is_admin: false }; // 10-es kéri a 99-est

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(userService.getUserById).not.toHaveBeenCalled();
        });
    });

    // --- UPDATE USER TESZTEK (Privilege Escalation) ---
    describe('updateUser', () => {
        test('Sima felhasználó nem adhat magának admin jogot (Security Case)', async () => {
            req.params.id = '10';
            req.user = { user_id: '10', is_admin: false }; // Feladó nem admin
            req.body = { name: 'Hacker', is_admin: true }; // Admin akar lenni
            
            userService.updateUser.mockResolvedValue({ id: '10', is_admin: false });

            await userController.updateUser(req, res);

            // Ellenőrizzük, hogy a szerviznek kényszerített false státuszt küldtünk-e
            expect(userService.updateUser).toHaveBeenCalledWith('10', expect.objectContaining({
                is_admin: false 
            }));
        });

        test('Admin módosíthatja más admin státuszát', async () => {
            req.params.id = '20';
            req.user = { user_id: '1', is_admin: true }; // Feladó admin
            req.body = { is_admin: true };

            await userController.updateUser(req, res);

            expect(userService.updateUser).toHaveBeenCalledWith('20', expect.objectContaining({
                is_admin: true
            }));
        });
    });

    // --- DELETE USER TESZTEK ---
    describe('deleteUser', () => {
        test('Nem létező felhasználó törlése (404)', async () => {
            req.params.id = '500';
            req.user = { user_id: '1', is_admin: true };
            userService.deleteUser.mockResolvedValue(null);

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('Saját fiók törlése (200)', async () => {
            req.params.id = '10';
            req.user = { user_id: '10', is_admin: false };
            userService.deleteUser.mockResolvedValue(true);

            await userController.deleteUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });

    // --- GET ALL USERS TESZTEK ---
    describe('getAllUsers', () => {
        test('Összes felhasználó listázása (200)', async () => {
            // Itt feltételezzük, hogy az admin védelem már lefutott a router szintjén
            userService.getAllUsers.mockResolvedValue([{ id: 1 }, { id: 2 }]);

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });
});