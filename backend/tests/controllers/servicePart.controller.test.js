const servicePartController = require('../../src/controllers/servicePart.controller');
const servicePartService = require('../../src/services/servicePart.service');


jest.mock('../../src/services/servicePart.service');

describe('ServicePart Controller', () => {
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

  describe('createServicePart', () => {
    it('400-as hibát ad, ha hiányzik a part_id', async () => {
      req.body = { service_id: 1, quantity: 2, unit_price: 1500 };

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "part_id is required" });
    });

    it('400-as hibát ad, ha a mennyiség (quantity) nulla vagy hiányzik', async () => {
      
      req.body = { service_id: 1, part_id: 1, quantity: 0, unit_price: 1500 };

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "quantity is required" });
    });

    it('201-et és a mentett objektumot adja vissza sikeres mentéskor', async () => {
      const mockData = { service_id: 1, part_id: 5, quantity: 1, unit_price: 10000 };
      req.body = mockData;
      servicePartService.createServicePart.mockResolvedValue({ id: 99, ...mockData });

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 99 }));
    });
  });

  describe('getAllServiceParts', () => {
    it('le kell kérnie az összes felhasznált alkatrészt', async () => {
      const mockList = [{ id: 1, part_id: 1 }, { id: 2, part_id: 2 }];
      servicePartService.getAllServiceParts.mockResolvedValue(mockList);

      await servicePartController.getAllServiceParts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockList);
    });
  });

  describe('getServicePartById', () => {
    it('404-et ad, ha az ID alapján nem található a rekord', async () => {
      req.params.id = '999';
      servicePartService.getServicePartById.mockResolvedValue(null);

      await servicePartController.getServicePartById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "ServicePart not found" });
    });
  });

  describe('updateServicePart', () => {
    it('404-et ad, ha a frissítendő rekord nem létezik', async () => {
      req.params.id = '1';
      req.body = { service_id: 1, part_id: 1, quantity: 1, unit_price: 100 };
      servicePartService.updateServicePart.mockResolvedValue(null);

      await servicePartController.updateServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('sikeres frissítésnél visszaküldi a frissített adatokat', async () => {
      const updateData = { service_id: 1, part_id: 1, quantity: 5, unit_price: 200 };
      req.params.id = '10';
      req.body = updateData;
      servicePartService.updateServicePart.mockResolvedValue({ id: 10, ...updateData });

      await servicePartController.updateServicePart(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ quantity: 5 }));
    });
  });

  describe('deleteServicePart', () => {
    it('sikeres törlésnél visszaadja a törölt rekordot vagy eredményt', async () => {
      req.params.id = '20';
      servicePartService.deleteServicePart.mockResolvedValue({ id: 20, deleted: true });

      await servicePartController.deleteServicePart(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 20, deleted: true });
    });
  });
});