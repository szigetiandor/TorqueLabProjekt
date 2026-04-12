const serviceLogController = require('../../src/controllers/serviceLog.controller');
const serviceLogService = require('../../src/services/serviceLog.service');

// A szerviz réteg mockolása
jest.mock('../../src/services/serviceLog.service');

describe('ServiceLogController Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
        // Console error/log elnyomása tesztelés alatt
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    // --- createServiceLog ---
    describe('createServiceLog', () => {
        test('Sikeres létrehozás (201)', async () => {
            req.body = { car_id: 1, service_date: '2024-03-20', description: 'Olajcsere', status: 'Pending' };
            serviceLogService.createService.mockResolvedValue({ id: 100, ...req.body, performed_by: 1 });

            await serviceLogController.createServiceLog(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(serviceLogService.createService).toHaveBeenCalledWith(expect.objectContaining({
                car_id: 1,
                performed_by: 1 // Alapértelmezett érték ellenőrzése
            }));
        });

        test('Hiba: Hiányzó car_id (400)', async () => {
            req.body = { service_date: '2024-03-20' };
            await serviceLogController.createServiceLog(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Car ID is required' });
        });
    });

    // --- getServiceComments ---
    describe('getServiceComments', () => {
        test('Kommentek sikeres lekérése (200)', async () => {
            req.params.id = '100';
            const mockComments = [{ id: 1, comment: 'Minden rendben' }];
            serviceLogService.getCommentsByServiceId.mockResolvedValue(mockComments);

            await serviceLogController.getServiceComments(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockComments);
        });

        test('Hiba: Szerver hiba (500)', async () => {
            req.params.id = '100';
            serviceLogService.getCommentsByServiceId.mockRejectedValue(new Error('DB hiba'));
            
            await serviceLogController.getServiceComments(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- getAllServiceLogs ---
    describe('getAllServiceLogs', () => {
        test('Összes log lekérése', async () => {
            serviceLogService.getAllServices.mockResolvedValue([{ id: 1 }]);
            await serviceLogController.getAllServiceLogs(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });

    // --- getServiceLogById ---
    describe('getServiceLogById', () => {
        test('Létező log lekérése (200)', async () => {
            req.params.id = '5';
            serviceLogService.getServiceById.mockResolvedValue({ id: 5 });
            await serviceLogController.getServiceLogById(req, res);
            expect(res.json).toHaveBeenCalledWith({ id: 5 });
        });

        test('Hiba: Nem létező log (404)', async () => {
            req.params.id = '999';
            serviceLogService.getServiceById.mockResolvedValue(null);
            await serviceLogController.getServiceLogById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // --- updateServiceLog ---
    describe('updateServiceLog', () => {
        test('Sikeres módosítás (200)', async () => {
            req.params.id = '1';
            req.body = { car_id: 1, performed_by: 2, service_date: '2024-01-01', description: 'Javítva', status: 'Completed' };
            serviceLogService.updateService.mockResolvedValue({ id: 1, ...req.body });

            await serviceLogController.updateServiceLog(req, res);

            expect(res.json).toHaveBeenCalled();
            expect(serviceLogService.updateService).toHaveBeenCalledWith('1', req.body);
        });

        test('Hiba: Hiányzó mezők a módosításnál (400)', async () => {
            req.body = { car_id: 1 }; // performed_by és dátum hiányzik
            await serviceLogController.updateServiceLog(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    // --- deleteServiceLog ---
    describe('deleteServiceLog', () => {
        test('Sikeres törlés', async () => {
            req.params.id = '1';
            serviceLogService.deleteService.mockResolvedValue({ id: 1 });
            await serviceLogController.deleteServiceLog(req, res);
            expect(res.json).toHaveBeenCalled();
        });

        test('Hiba: Törlendő log nem található (404)', async () => {
            req.params.id = '999';
            serviceLogService.deleteService.mockResolvedValue(null);
            await serviceLogController.deleteServiceLog(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // --- getMyServiceLogs ---
    describe('getMyServiceLogs', () => {
        test('Saját logok lekérése a req.user-ből (200)', async () => {
            req.user = { user_id: 42 };
            const mockLogs = [{ id: 1, car_id: 5, description: 'Saját szerviz' }];
            serviceLogService.getLogsByOwner.mockResolvedValue(mockLogs);

            await serviceLogController.getMyServiceLogs(req, res);

            expect(serviceLogService.getLogsByOwner).toHaveBeenCalledWith(42);
            expect(res.json).toHaveBeenCalledWith(mockLogs);
        });

        test('Hiba: Lekérés sikertelen (500)', async () => {
            req.user = { user_id: 42 };
            serviceLogService.getLogsByOwner.mockRejectedValue(new Error('Szerver hiba'));
            await serviceLogController.getMyServiceLogs(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});