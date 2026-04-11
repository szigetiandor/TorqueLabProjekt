const request = require('supertest');
const express = require('express');
const serviceLogRoutes = require('../../src/routes/serviceLog.routes');
const serviceLogController = require('../../src/controllers/serviceLog.controller');


jest.mock('../../src/controllers/serviceLog.controller');

const app = express();
app.use(express.json());
app.use('/service-logs', serviceLogRoutes);

describe('ServiceLog Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /service-logs', () => {
    it('meghívja a createServiceLog kontrollert', async () => {
      serviceLogController.createServiceLog.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/service-logs')
        .send({ car_id: 1, description: 'Olajcsere' });

      expect(res.statusCode).toBe(201);
      expect(serviceLogController.createServiceLog).toHaveBeenCalled();
    });
  });

  describe('GET /service-logs', () => {
    it('meghívja a getAllServiceLogs kontrollert', async () => {
      serviceLogController.getAllServiceLogs.mockImplementation((req, res) => res.status(200).json([]));

      const res = await request(app).get('/service-logs');

      expect(res.statusCode).toBe(200);
      expect(serviceLogController.getAllServiceLogs).toHaveBeenCalled();
    });
  });

  describe('GET /service-logs/:id', () => {
    it('meghívja a getServiceLogById kontrollert a megadott ID-val', async () => {
      serviceLogController.getServiceLogById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

      const res = await request(app).get('/service-logs/77');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('77');
      expect(serviceLogController.getServiceLogById).toHaveBeenCalled();
    });
  });

  describe('PUT /service-logs/:id', () => {
    it('meghívja az updateServiceLog kontrollert', async () => {
      serviceLogController.updateServiceLog.mockImplementation((req, res) => res.status(200).json({ updated: true }));

      const res = await request(app)
        .put('/service-logs/77')
        .send({ description: 'Módosított leírás' });

      expect(res.statusCode).toBe(200);
      expect(serviceLogController.updateServiceLog).toHaveBeenCalled();
    });
  });

  describe('DELETE /service-logs/:id', () => {
    it('meghívja a deleteServiceLog kontrollert', async () => {
      serviceLogController.deleteServiceLog.mockImplementation((req, res) => res.status(200).json({ success: true }));

      const res = await request(app).delete('/service-logs/77');

      expect(res.statusCode).toBe(200);
      expect(serviceLogController.deleteServiceLog).toHaveBeenCalled();
    });
  });
});