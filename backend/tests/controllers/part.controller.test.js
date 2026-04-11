const partController = require('../../src/controllers/part.controller');
const partService = require('../../src/services/part.service');


jest.mock('../../src/services/part.service');

describe('Part Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllParts', () => {
    it('le kell kérnie az alkatrészeket a query és price szűrők alapján', async () => {
      const mockParts = [{ id: 1, name: 'Féktárcsa' }];
      req.query = { query: 'fék', price: '5000' };
      partService.getAllParts.mockResolvedValue(mockParts);

      await partController.getAllParts(req, res);

      expect(partService.getAllParts).toHaveBeenCalledWith('fék', '5000');
      expect(res.json).toHaveBeenCalledWith(mockParts);
    });
  });

  describe('createPart', () => {
    it('400-as hibát kell dobnia, ha hiányzik egy kötelező mező', async () => {
      
      req.body = { name: 'Váltóolaj' };

      await partController.createPart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Minden mező kitöltése kötelező!" });
      
      expect(partService.createPart).not.toHaveBeenCalled();
    });

    it('201-et kell adnia és mentenie, ha minden adat stimmel', async () => {
      const validPart = {
        name: 'Gyertya',
        manufacturer: 'NGK',
        part_number: 'BKR6E',
        price: 1500,
        stock_quantity: 10,
        description: 'Standard gyertya'
      };
      req.body = validPart;
      partService.createPart.mockResolvedValue({ id: 1, ...validPart });

      await partController.createPart(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(partService.createPart).toHaveBeenCalledWith(validPart);
    });
  });

  describe('getPartById', () => {
    it('404-et kell adnia, ha az alkatrész nem létezik', async () => {
      req.params.id = '999';
      partService.getPartById.mockResolvedValue(null);

      await partController.getPartById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Alkatrész nem található" });
    });
  });

  describe('updatePart', () => {
    it('sikeres frissítésnél a frissített objektumot kell visszaadnia', async () => {
      const updatedData = { price: 2000 };
      req.params.id = '1';
      req.body = updatedData;
      partService.updatePart.mockResolvedValue({ id: 1, name: 'Gyertya', ...updatedData });

      await partController.updatePart(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updatedData));
    });
  });

  describe('deletePart', () => {
    it('sikeres törlésnél 200-as kódot és üzenetet kell küldenie', async () => {
      req.params.id = '10';
      partService.deletePart.mockResolvedValue(true);

      await partController.deletePart(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Sikeres törlés" });
    });

    it('ha a törlés sikertelen (nem létezik), 404-et kell adnia', async () => {
      req.params.id = '10';
      partService.deletePart.mockResolvedValue(false);

      await partController.deletePart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Sikertelen törlés" });
    });
  });
});