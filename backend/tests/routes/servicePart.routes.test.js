const request = require('supertest');
const express = require('express');
const servicePartRoutes = require('../../src/routes/servicePart.routes');
const servicePartController = require('../../src/controllers/servicePart.controller');


jest.mock('../../src/controllers/servicePart.controller');

const app = express();
app.use(express.json());
app.use('/service-parts', servicePartRoutes);

describe('ServicePart Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /service-parts', () => {
    it('meghívja a createServicePart kontrollert', async () => {
      servicePartController.createServicePart.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/service-parts')
        .send({ service_id: 1, part_id: 2, quantity: 4 });

      expect(res.statusCode).toBe(201);
      expect(servicePartController.createServicePart).toHaveBeenCalled();
    });
  });

  describe('GET /service-parts', () => {
    it('meghívja a getAllServiceParts kontrollert', async () => {
      servicePartController.getAllServiceParts.mockImplementation((req, res) => res.status(200).json([]));

      const res = await request(app).get('/service-parts');

      expect(res.statusCode).toBe(200);
      expect(servicePartController.getAllServiceParts).toHaveBeenCalled();
    });
  });

  describe('GET /service-parts/:id', () => {
    it('meghívja a getServicePartById kontrollert a megadott ID-val', async () => {
      servicePartController.getServicePartById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

      const res = await request(app).get('/service-parts/500');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('500');
      expect(servicePartController.getServicePartById).toHaveBeenCalled();
    });
  });

  describe('PUT /service-parts/:id', () => {
    it('meghívja az updateServicePart kontrollert', async () => {
      servicePartController.updateServicePart.mockImplementation((req, res) => res.status(200).json({ updated: true }));

      const res = await request(app)
        .put('/service-parts/500')
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(200);
      expect(servicePartController.updateServicePart).toHaveBeenCalled();
    });
  });

  describe('DELETE /service-parts/:id', () => {
    it('meghívja a deleteServicePart kontrollert', async () => {
      servicePartController.deleteServicePart.mockImplementation((req, res) => res.status(200).json({ success: true }));

      const res = await request(app).delete('/service-parts/500');

      expect(res.statusCode).toBe(200);
      expect(servicePartController.deleteServicePart).toHaveBeenCalled();
    });
  });
});