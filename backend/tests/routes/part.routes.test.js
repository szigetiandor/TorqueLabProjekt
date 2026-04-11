const request = require('supertest');
const express = require('express');
const partRoutes = require('../../src/routes/part.routes');
const partController = require('../../src/controllers/part.controller');


jest.mock('../../src/controllers/part.controller');

const app = express();
app.use(express.json());
app.use('/parts', partRoutes);

describe('Part Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /parts', () => {
    it('meg kell hívnia a partController.createPart-t', async () => {
      partController.createPart.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/parts')
        .send({ name: 'Féktárcsa', manufacturer: 'Brembo' });

      expect(res.statusCode).toBe(201);
      expect(partController.createPart).toHaveBeenCalled();
    });
  });

  describe('GET /parts', () => {
    it('meg kell hívnia a partController.getAllParts-t', async () => {
      partController.getAllParts.mockImplementation((req, res) => res.status(200).json([]));

      const res = await request(app).get('/parts');

      expect(res.statusCode).toBe(200);
      expect(partController.getAllParts).toHaveBeenCalled();
    });
  });

  describe('GET /parts/:id', () => {
    it('meg kell hívnia a partController.getPartById-t', async () => {
      partController.getPartById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

      const res = await request(app).get('/parts/100');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('100');
      expect(partController.getPartById).toHaveBeenCalled();
    });
  });

  describe('PUT /parts/:id', () => {
    it('meg kell hívnia a partController.updatePart-t', async () => {
      partController.updatePart.mockImplementation((req, res) => res.status(200).json({ updated: true }));

      const res = await request(app)
        .put('/parts/100')
        .send({ price: 25000 });

      expect(res.statusCode).toBe(200);
      expect(partController.updatePart).toHaveBeenCalled();
    });
  });

  describe('DELETE /parts/:id', () => {
    it('meg kell hívnia a partController.deletePart-t', async () => {
      partController.deletePart.mockImplementation((req, res) => res.status(200).json({ success: true }));

      const res = await request(app).delete('/parts/100');

      expect(res.statusCode).toBe(200);
      expect(partController.deletePart).toHaveBeenCalled();
    });
  });
});