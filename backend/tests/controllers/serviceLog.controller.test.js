const serviceLogController = require('../../src/controllers/serviceLog.controller');
const serviceLogService = require('../../src/services/serviceLog.service');


jest.mock('../../src/services/serviceLog.service');

describe('ServiceLog Controller', () => {
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

  describe('createServiceLog', () => {
    it('400-as hibát ad, ha hiányzik a car_id', async () => {
      req.body = { performed_by: 'Kovács Úr', service_date: '2024-05-10' };

      await serviceLogController.createServiceLog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Car ID is required" });
    });

    it('400-as hibát ad, ha hiányzik a performed_by', async () => {
      req.body = { car_id: 1, service_date: '2024-05-10' };

      await serviceLogController.createServiceLog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "performed by is required" });
    });

    it('sikeres létrehozásnál 201-et és a mentett naplót adja vissza', async () => {
      const validLog = { car_id: 1, performed_by: 'Szerelő', service_date: '2024-05-10', description: 'Olajcsere' };
      req.body = validLog;
      serviceLogService.createService.mockResolvedValue({ id: 55, ...validLog });

      await serviceLogController.createServiceLog(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 55 }));
    });
  });

  describe('getAllServiceLogs', () => {
    it('le kell kérnie az összes szerviz bejegyzést', async () => {
      const mockLogs = [{ id: 1, car_id: 1 }, { id: 2, car_id: 2 }];
      serviceLogService.getAllServices.mockResolvedValue(mockLogs);

      await serviceLogController.getAllServiceLogs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });
  });

  describe('getServiceLogById', () => {
    it('404-et ad, ha a bejegyzés nem található', async () => {
      req.params.id = '99';
      serviceLogService.getServiceById.mockResolvedValue(null);

      await serviceLogController.getServiceLogById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "ServiceLog not found" });
    });
  });

  describe('updateServiceLog', () => {
    it('ellenőriznie kell a kötelező mezőket frissítésnél is', async () => {
      req.params.id = '1';
      req.body = { car_id: 1 }; 

      await serviceLogController.updateServiceLog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('sikeres frissítésnél 200-at (alapértelmezett) és az új adatokat adja vissza', async () => {
      req.params.id = '1';
      const updateData = { car_id: 1, performed_by: 'Jani', service_date: '2024-06-01' };
      req.body = updateData;
      serviceLogService.updateService.mockResolvedValue({ id: 1, ...updateData });

      await serviceLogController.updateServiceLog(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });
  });

  describe('deleteServiceLog', () => {
    it('sikeres törlésnél visszaadja a törölt bejegyzés adatait/vagy siker üzenetet', async () => {
      req.params.id = '10';
      serviceLogService.deleteService.mockResolvedValue({ id: 10, deleted: true });

      await serviceLogController.deleteServiceLog(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 10, deleted: true });
    });
  });
});