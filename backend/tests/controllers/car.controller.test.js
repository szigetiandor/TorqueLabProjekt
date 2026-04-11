const carController = require('../../src/controllers/car.controller');
const carService = require('../../src/services/car.service');


jest.mock('../../src/services/car.service');

describe('Car Controller', () => {
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

  describe('createCar', () => {
    it('201-es kódot és a létrehozott autót kell visszaadnia', async () => {
      const mockCar = { id: 1, brand: 'BMW', model: 'M3' };
      req.body = mockCar;
      carService.createCar.mockResolvedValue(mockCar);

      await carController.createCar(req, res);

      expect(carService.createCar).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCar);
    });

    it('500-as hibát kell dobnia, ha a service hibázik', async () => {
      carService.createCar.mockRejectedValue(new Error('Database error'));

      await carController.createCar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getAllCars', () => {
    it('le kell kérnie az összes autót a query paraméterek alapján', async () => {
      const mockCars = [{ id: 1, model: 'Civic' }, { id: 2, model: 'Accord' }];
      req.query = { model: 'Honda', type: 'sedan' };
      carService.getAllCars.mockResolvedValue(mockCars);

      await carController.getAllCars(req, res);

      expect(carService.getAllCars).toHaveBeenCalledWith('Honda', 'sedan');
      expect(res.json).toHaveBeenCalledWith(mockCars);
    });
  });

  describe('getCarById', () => {
    it('200-at kell adnia, ha megtalálja az autót', async () => {
      const mockCar = { id: 10, model: '911' };
      req.params.id = '10';
      carService.getCarById.mockResolvedValue(mockCar);

      await carController.getCarById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCar);
    });

    it('404-et kell adnia, ha nem létezik az autó', async () => {
      req.params.id = '999';
      carService.getCarById.mockResolvedValue(null);

      await carController.getCarById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Car not found' });
    });
  });

  describe('updateCar', () => {
    it('sikeres frissítésnél az új adatokat kell visszaadnia', async () => {
      const updatedCar = { id: 1, model: 'Updated Model' };
      req.params.id = '1';
      req.body = { model: 'Updated Model' };
      carService.updateCar.mockResolvedValue(updatedCar);

      await carController.updateCar(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedCar);
    });
  });

  describe('deleteCar', () => {
    it('sikeres törlésnél üzenetet kell küldenie', async () => {
      req.params.id = '5';
      carService.deleteCar.mockResolvedValue(true);

      await carController.deleteCar(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Car deleted successfully" });
    });

    it('ha nincs mit törölni, 404-et kell adnia', async () => {
      req.params.id = '5';
      carService.deleteCar.mockResolvedValue(false);

      await carController.deleteCar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});