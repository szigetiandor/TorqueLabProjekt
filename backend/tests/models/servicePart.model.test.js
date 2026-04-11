const servicePartModel = require('../../src/models/servicePart.model');
const { getPool } = require('../../src/database');

jest.mock('../../src/database');

describe('ServicePart Model', () => {
  let mockRequest;
  let mockPool;

  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };
    mockPool = { request: jest.fn(() => mockRequest) };
    getPool.mockResolvedValue(mockPool);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('létrehoz egy kapcsolatot a szerviz és az alkatrész között', async () => {
      const input = { service_id: 1, part_id: 5, quantity: 2, unit_price: 1500 };
      mockRequest.query.mockResolvedValue({ recordset: [input] });

      const result = await servicePartModel.create(input);

      expect(result).toBeInstanceOf(servicePartModel.ServicePart);
      expect(mockRequest.input).toHaveBeenCalledWith('unit_price', 1500);
    });
  });

  describe('update', () => {
    it('frissíti a rekordot (figyelem: a kódodban service_id alapú a WHERE)', async () => {
      const updateData = { service_id: 1, part_id: 5, quantity: 10, unit_price: 2000 };
      mockRequest.query.mockResolvedValue({ recordset: [updateData] });

      const result = await servicePartModel.update(1, updateData);

      expect(result.quantity).toBe(10);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("WHERE service_part_id=@id"));
    });
  });
});