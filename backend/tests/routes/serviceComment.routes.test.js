const request = require('supertest');
const express = require('express');
const serviceCommentRoutes = require('../../src/routes/serviceComment.routes');
const serviceCommentController = require('../../src/controllers/serviceComment.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');


jest.mock('../../src/controllers/serviceComment.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/service-comments', serviceCommentRoutes);

describe('ServiceComment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    
    authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    authMiddleware.verifyAdmin.mockImplementation((req, res, next) => next());
  });

  describe('Biztonsági lánc ellenőrzése', () => {
    it('minden végpontnak admin jogot kell kérnie', async () => {
      serviceCommentController.getAllServiceComments.mockImplementation((req, res) => res.sendStatus(200));

      await request(app).get('/service-comments');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(serviceCommentController.getAllServiceComments).toHaveBeenCalled();
    });

    it('403-at kell adnia, ha a felhasználó be van jelentkezve, de nem admin', async () => {
      
      authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
        return res.status(403).json({ error: "Admin role required" });
      });

      const res = await request(app).post('/service-comments').send({ comment: "Próba" });

      expect(res.statusCode).toBe(403);
      
      expect(serviceCommentController.createServiceComment).not.toHaveBeenCalled();
    });
  });

  describe('CRUD végpontok bekötése', () => {
    it('PUT /service-comments/:id a módosításhoz vezet', async () => {
      serviceCommentController.updateServiceComment.mockImplementation((req, res) => res.sendStatus(200));

      const res = await request(app).put('/service-comments/5').send({ comment: "Módosítva" });

      expect(res.statusCode).toBe(200);
      expect(serviceCommentController.updateServiceComment).toHaveBeenCalled();
    });

    it('DELETE /service-comments/:id a törléshez vezet', async () => {
      serviceCommentController.deleteServiceComment.mockImplementation((req, res) => res.sendStatus(200));

      const res = await request(app).delete('/service-comments/10');

      expect(res.statusCode).toBe(200);
      expect(serviceCommentController.deleteServiceComment).toHaveBeenCalled();
    });
  });
});
