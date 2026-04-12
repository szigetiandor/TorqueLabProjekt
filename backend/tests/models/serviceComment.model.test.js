const serviceCommentModel = require('../../src/models/serviceComment.model');
const { getPool } = require('../../src/database');


jest.mock('../../src/database');

describe('ServiceComment Model', () => {
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
    it('be kell szúrnia egy új megjegyzést és visszaadni azt', async () => {
      const newComment = { by_user: 1, service_id: 10, comment: 'Minden rendben' };
      mockRequest.query.mockResolvedValue({ recordset: [{ service_comment_id: 1, ...newComment }] });

      const result = await serviceCommentModel.create(newComment);

      expect(mockRequest.input).toHaveBeenCalledWith('by_user', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('service_id', 10);
      expect(result.service_comment_id).toBe(1);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO service_comment"));
    });
  });

  describe('findAll', () => {
    it('le kell kérnie az összes megjegyzést', async () => {
      const mockRows = [{ service_comment_id: 1, comment: 'A' }, { service_comment_id: 2, comment: 'B' }];
      mockRequest.query.mockResolvedValue({ recordset: mockRows });

      const result = await serviceCommentModel.findAll();

      expect(result).toHaveLength(2);
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM service_comment');
    });
  });

  describe('findById', () => {
    it('vissza kell adnia a megjegyzést, ha létezik az ID', async () => {
      const mockComment = { service_comment_id: 5, comment: 'Teszt' };
      mockRequest.query.mockResolvedValue({ recordset: [mockComment] });

      const result = await serviceCommentModel.findById(5);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 5);
      expect(result.comment).toBe('Teszt');
    });

    it('null-t kell adnia, ha nem található', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await serviceCommentModel.findById(99);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('frissítenie kell a megjegyzést és visszaadni a módosítottat', async () => {
      const updateData = { by_user: 1, comment: 'Frissített szöveg' };
      mockRequest.query.mockResolvedValue({ recordset: [{ service_comment_id: 1, ...updateData }] });

      const result = await serviceCommentModel.update(1, updateData);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('comment', 'Frissített szöveg');
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE service_comment"));
    });
  });

  describe('remove', () => {
    it('true-t kell adnia sikeres törlés esetén', async () => {
      mockRequest.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await serviceCommentModel.remove(1);

      expect(result).toBe(true);
      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
    });
  });
});