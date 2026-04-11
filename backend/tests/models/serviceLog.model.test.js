const serviceLogModel = require('../../src/models/serviceLog.model');
const { getPool } = require('../../src/database');


jest.mock('../../src/database');

describe('ServiceLog Model', () => {
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

  describe('create', () => {
    it('létre kell hoznia egy szerviz bejegyzést és ServiceLog példányt kell visszaadnia', async () => {
      const inputData = {
        car_id: 1,
        performed_by: 2,
        service_date: '2026-04-11',
        description: 'Éves szerviz'
      };
      
      mockRequest.query.mockResolvedValue({ 
        recordset: [{ service_id: 100, ...inputData }] 
      });

      const result = await serviceLogModel.create(inputData);

      expect(result).toBeInstanceOf(serviceLogModel.ServiceLog);
      expect(result.service_id).toBe(100);
      expect(mockRequest.input).toHaveBeenCalledWith('description', 'Éves szerviz');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO service_log"));
    });
  });

  describe('findAll', () => {
    it('vissza kell adnia az összes szerviz bejegyzést ServiceLog példányokként', async () => {
      const mockRows = [
        { service_id: 1, car_id: 1, description: 'Olajcsere' },
        { service_id: 2, car_id: 1, description: 'Fékjavítás' }
      ];
      mockRequest.query.mockResolvedValue({ recordset: mockRows });

      const result = await serviceLogModel.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(serviceLogModel.ServiceLog);
      expect(result[1].description).toBe('Fékjavítás');
    });
  });

  describe('findById', () => {
    it('ServiceLog példányt kell visszaadnia, ha létezik az ID', async () => {
      const mockRow = { service_id: 50, car_id: 1, description: 'Teszt' };
      mockRequest.query.mockResolvedValue({ recordset: [mockRow] });

      const result = await serviceLogModel.findById(50);

      expect(result).toBeInstanceOf(serviceLogModel.ServiceLog);
      expect(result.service_id).toBe(50);
      expect(mockRequest.input).toHaveBeenCalledWith('id', 50);
    });

    it('null-t kell adnia, ha a bejegyzés nem található', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await serviceLogModel.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('frissítenie kell a rekordot és visszaadnia a módosított példányt', async () => {
      const updateData = { car_id: 1, performed_by: 2, service_date: '2026-05-01', description: 'Frissítve' };
      mockRequest.query.mockResolvedValue({ recordset: [{ service_id: 1, ...updateData }] });

      const result = await serviceLogModel.update(1, updateData);

      expect(result.description).toBe('Frissítve');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE service_log SET"));
      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('remove', () => {
    it('true-t kell adnia, ha a törlés sikeres (rowsAffected > 0)', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await serviceLogModel.remove(123);

      expect(result).toBe(true);
      expect(mockRequest.input).toHaveBeenCalledWith('id', 123);
    });

    it('false-t kell adnia, ha nem történt törlés', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [0] });

      const result = await serviceLogModel.remove(123);

      expect(result).toBe(false);
    });
  });
});