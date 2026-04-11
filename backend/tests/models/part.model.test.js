const partModel = require('../../src/models/part.model');
const { getPool } = require('../../src/database');

jest.mock('../../src/database');

describe('Part Model', () => {
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
    it('vissza kell adnia az összes alkatrészt Part példányként', async () => {
      const mockData = [
        { part_id: 1, name: 'Féktárcsa', price: 15000 },
        { part_id: 2, name: 'Fékbetét', price: 8000 }
      ];
      mockRequest.query.mockResolvedValue({ recordset: mockData });

      const result = await partModel.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(partModel.Part);
      expect(result[0].name).toBe('Féktárcsa');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM part WHERE 1=1"));
    });

    it('helyesen kell kezelnie a searchQuery-t (kötőjelek cseréje és LIKE)', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      
      await partModel.findAll('olaj-szűrő', null);

      
      expect(mockRequest.input).toHaveBeenCalledWith('search', '%olaj szűrő%');
      
      const sqlCall = mockRequest.query.mock.calls[0][0];
      expect(sqlCall).toContain("name] LIKE @search OR manufacturer LIKE @search");
    });

    it('alkalmaznia kell a maxPrice szűrőt, ha meg van adva', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      await partModel.findAll(null, 5000);

      expect(mockRequest.input).toHaveBeenCalledWith('maxPrice', 5000);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("AND price <= @maxPrice"));
    });
  });

  describe('create', () => {
    it('el kell küldenie az összes mezőt és vissza kell adnia az új alkatrészt', async () => {
      const newPart = {
        name: 'Gyertya',
        manufacturer: 'NGK',
        part_number: 'BKR6E',
        price: 1200,
        stock_quantity: 50,
        description: 'Iridium gyertya'
      };
      mockRequest.query.mockResolvedValue({ recordset: [{ part_id: 10, ...newPart }] });

      const result = await partModel.create(newPart);

      expect(mockRequest.input).toHaveBeenCalledWith('name', 'Gyertya');
      expect(mockRequest.input).toHaveBeenCalledWith('manufacturer', 'NGK');
      expect(result.part_id).toBe(10);
      expect(result).toBeInstanceOf(partModel.Part);
    });
  });

  describe('findById', () => {
    it('null-t kell adnia, ha az alkatrész nem létezik', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await partModel.findById(999);

      expect(result).toBeNull();
      expect(mockRequest.input).toHaveBeenCalledWith('id', 999);
    });
  });

  describe('update', () => {
    it('frissítenie kell az adatokat és visszaadnia a módosított objektumot', async () => {
      const updateData = { name: 'Módosított név', price: 2000 };
      mockRequest.query.mockResolvedValue({ recordset: [{ part_id: 1, ...updateData }] });

      const result = await partModel.update(1, updateData);

      expect(result.name).toBe('Módosított név');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE part SET"));
    });
  });

  describe('remove', () => {
    it('true-t ad, ha sikeres a törlés', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await partModel.remove(1);

      expect(result).toBe(true);
    });
  });
});