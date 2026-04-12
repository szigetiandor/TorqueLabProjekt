const carModel = require('../../src/models/car.model');
const { getPool } = require('../../src/database');


jest.mock('../../src/database');

describe('Car Model', () => {
  let mockRequest;
  let mockPool;

  beforeEach(() => {
    
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };

    mockPool = {
      request: jest.fn(() => mockRequest)
    };

    getPool.mockResolvedValue(mockPool);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('vissza kell adnia a Car osztály példányait', async () => {
      const mockRows = [
        { car_id: 1, brand: 'Audi', model: 'A4', price: 5000000 },
        { car_id: 2, brand: 'BMW', model: 'M3', price: 12000000 }
      ];
      mockRequest.query.mockResolvedValue({ recordset: mockRows });

      const result = await carModel.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(carModel.Car);
      expect(result[1].model).toBe('M3');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM car"));
    });

    it('dinamikusan hozzá kell adnia a model és type szűrőket a SQL-hez', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      await carModel.findAll('Supra', 'Coupe');

      
      expect(mockRequest.input).toHaveBeenCalledWith('model', '%Supra%');
      expect(mockRequest.input).toHaveBeenCalledWith('type', 'Coupe');
      
      
      const sqlCall = mockRequest.query.mock.calls[0][0];
      expect(sqlCall).toContain("AND model LIKE @model");
      expect(sqlCall).toContain("AND build_type = @type");
    });
  });

  describe('findById', () => {
    it('null-t kell visszaadnia, ha nincs találat', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await carModel.findById(99);

      expect(result).toBeNull();
      expect(mockRequest.input).toHaveBeenCalledWith('id', 99);
    });
  });

  describe('create', () => {
    it('OUTPUT INSERTED.* használatával vissza kell adnia az új Car példányt', async () => {
      const newCarData = { vin: 'VIN123', brand: 'Toyota', model: 'Yaris' };
      mockRequest.query.mockResolvedValue({ recordset: [{ car_id: 5, ...newCarData }] });

      const result = await carModel.create(newCarData);

      expect(result.car_id).toBe(5);
      expect(result).toBeInstanceOf(carModel.Car);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO car"));
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("OUTPUT INSERTED.*"));
    });
  });

  describe('remove', () => {
    it('true-val tér vissza, ha sikeres a törlés', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await carModel.remove(1);

      expect(result).toBe(true);
    });

    it('false-al tér vissza, ha nem talált törölhető sort', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [0] });

      const result = await carModel.remove(1);

      expect(result).toBe(false);
    });
  });
});