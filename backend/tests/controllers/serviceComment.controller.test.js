const serviceCommentController = require('../../src/controllers/serviceComment.controller');
const serviceCommentService = require('../../src/services/serviceComment.service');


jest.mock('../../src/services/serviceComment.service');

describe('ServiceComment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { user_id: 123 } 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createServiceComment', () => {
    it('400-as hiba, ha hiányzik a service_id vagy a komment szövege', async () => {
      req.body = { service_id: 1 }; 

      await serviceCommentController.createServiceComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'service_id and comment are required' });
    });

    it('sikeres létrehozás (200) és a mentett objektum visszaadása', async () => {
      const mockResult = { service_comment_id: 1, comment: 'Olajcsere elvégezve', service_id: 10, by_user: 123 };
      req.body = { service_id: 10, comment: 'Olajcsere elvégezve' };
      serviceCommentService.createServiceComment.mockResolvedValue(mockResult);

      await serviceCommentController.createServiceComment(req, res);

      expect(serviceCommentService.createServiceComment).toHaveBeenCalledWith({
        by_user: 123,
        service_id: 10,
        comment: 'Olajcsere elvégezve'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getAllServiceComments', () => {
    it('vissza kell adnia az összes kommentet a service_comments kulcs alatt', async () => {
      const mockComments = [
        { service_comment_id: 1, comment: 'Első megjegyzés' },
        { service_comment_id: 2, comment: 'Második megjegyzés' }
      ];
      serviceCommentService.getAllServiceComments.mockResolvedValue(mockComments);

      await serviceCommentController.getAllServiceComments(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ service_comments: mockComments });
    });
  });

  describe('getServiceCommentById', () => {
    it('404-es hiba, ha nem létezik a keresett ID', async () => {
      req.params.id = '999';
      serviceCommentService.getServiceCommentById.mockResolvedValue(null);

      await serviceCommentController.getServiceCommentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'service comment not found' });
    });
  });

  describe('updateServiceComment', () => {
    it('400-as hiba, ha a komment szövege üres', async () => {
      req.params.id = '1';
      req.body = { comment: '' };

      await serviceCommentController.updateServiceComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'comment is required' });
    });

    it('sikeres frissítésnél (200) a módosított adatokat kell visszaadnia', async () => {
      const updatedMock = { service_comment_id: 1, comment: 'Módosított szöveg', by_user: 123 };
      req.params.id = '1';
      req.body = { comment: 'Módosított szöveg' };
      serviceCommentService.updateServiceComment.mockResolvedValue(updatedMock);

      await serviceCommentController.updateServiceComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedMock);
    });
  });

  describe('deleteServiceComment', () => {
    it('sikeres törlés esetén success: true választ ad', async () => {
      req.params.id = '5';
      serviceCommentService.deleteServiceComment.mockResolvedValue(true);

      await serviceCommentController.deleteServiceComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('ha nincs mit törölni, 404-es hibát dob', async () => {
      req.params.id = '5';
      serviceCommentService.deleteServiceComment.mockResolvedValue(false);

      await serviceCommentController.deleteServiceComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});