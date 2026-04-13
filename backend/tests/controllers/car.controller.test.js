const carController = require('../../src/controllers/car.controller');
const carService = require('../../src/services/car.service');

// A szerviz réteg mockolása
jest.mock('../../src/services/car.service');

describe('CarController Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    // --- createCar tesztek ---
    describe('createCar', () => {
        test('Sikeres létrehozás (201)', async () => {
            req.user = { user_id: 1 };
            req.body = { vin: '12345', brand: 'Toyota' };
            carService.createCar.mockResolvedValue({ id: 10, ...req.body, owner_id: 1 });

            await carController.createCar(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(carService.createCar).toHaveBeenCalledWith(expect.objectContaining({
                owner_id: 1,
                vin: '12345'
            }));
        });

        test('Hiba: Nem azonosítható felhasználó (401)', async () => {
            req.user = null; // Hiányzó user objektum
            await carController.createCar(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        test('Szerver hiba esetén 500-at ad', async () => {
            req.user = { user_id: 1 };
            carService.createCar.mockRejectedValue(new Error('DB Error'));
            await carController.createCar(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getAllCars tesztek ---
    describe('getAllCars', () => {
        test('Sikeres listázás query paraméterekkel', async () => {
            req.query = { model: 'Camry' };
            carService.getAllCars.mockResolvedValue([{ id: 1, model: 'Camry' }]);

            await carController.getAllCars(req, res);

            expect(carService.getAllCars).toHaveBeenCalledWith('Camry', undefined, undefined);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });

    // --- updateCar tesztek (Jogosultság fókusz) ---
    describe('updateCar', () => {
        test('Sikeres módosítás tulajdonosként', async () => {
            req.params.id = '10';
            req.user = { user_id: 5, is_admin: false };
            req.body = { mileage: 150000 };
            
            // Az autó azonosítója és a tulajdonosa egyezik a req.user-rel
            carService.getCarById.mockResolvedValue({ id: 10, owner_id: 5 });
            carService.updateCar.mockResolvedValue({ id: 10, owner_id: 5, mileage: 150000 });

            await carController.updateCar(req, res);

            expect(res.json).toHaveBeenCalled();
            expect(carService.updateCar).toHaveBeenCalled();
        });

        test('Sikeres módosítás Adminisztrátorként (még ha nem is övé)', async () => {
            req.params.id = '10';
            req.user = { user_id: 1, is_admin: true }; // Admin
            carService.getCarById.mockResolvedValue({ id: 10, owner_id: 999 }); // Másé az autó
            carService.updateCar.mockResolvedValue({ id: 10, updated: true });

            await carController.updateCar(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        test('Hiba: Hozzáférés megtagadva idegen felhasználónak (403)', async () => {
            req.params.id = '10';
            req.user = { user_id: 5, is_admin: false };
            carService.getCarById.mockResolvedValue({ id: 10, owner_id: 888 }); // Más a tulaj

            await carController.updateCar(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(carService.updateCar).not.toHaveBeenCalled();
        });

        test('Hiba: Gépjármű nem található (404)', async () => {
            req.params.id = '999';
            carService.getCarById.mockResolvedValue(null);

            await carController.updateCar(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // --- deleteCar tesztek ---
    describe('deleteCar', () => {
        test('Sikeres törlés tulajdonosként', async () => {
            req.params.id = '10';
            req.user = { user_id: 5, is_admin: false };
            carService.getCarById.mockResolvedValue({ id: 10, owner_id: 5 });
            carService.deleteCar.mockResolvedValue(true);

            await carController.deleteCar(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining("sikeresen") });
        });

        test('Hiba: Törlés elutasítva nem tulajdonosnak (403)', async () => {
            req.params.id = '10';
            req.user = { user_id: 5, is_admin: false };
            carService.getCarById.mockResolvedValue({ id: 10, owner_id: 999 });

            await carController.deleteCar(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(carService.deleteCar).not.toHaveBeenCalled();
        });
    });
});