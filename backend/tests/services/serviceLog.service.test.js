const serviceLogService = require('../../src/services/serviceLog.service');
const serviceLogModel = require('../../src/models/serviceLog.model');

jest.mock('../../src/models/serviceLog.model');

describe('ServiceLog Service - Deep Testing', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createService - Edge Cases', () => {
    it('kezelnie kell, ha a leírás (description) üres karakterlánc', async () => {
      const minimalData = { car_id: 1, description: "" };
      serviceLogModel.create.mockResolvedValue({ service_id: 1, ...minimalData });

      const result = await serviceLogService.createService(minimalData);

      expect(result.description).toBe("");
      expect(serviceLogModel.create).toHaveBeenCalled();
    });

    it('kezelnie kell a távoli jövőbeli vagy múltbeli dátumokat', async () => {
      
      const weirdData = { car_id: 1, service_date: '1850-01-01' };
      serviceLogModel.create.mockResolvedValue(weirdData);

      const result = await serviceLogService.createService(weirdData);
      expect(result.service_date).toBe('1850-01-01');
    });
  });

  describe('updateService - Edge Cases', () => {
    it('null-t kell adnia, ha egy nem létező szerviznaplót akarunk frissíteni', async () => {
      serviceLogModel.update.mockResolvedValue(null);

      const result = await serviceLogService.updateService(999, { status: 'Completed' });

      expect(result).toBeNull();
      expect(serviceLogModel.update).toHaveBeenCalledWith(999, { status: 'Completed' });
    });

    it('kezelnie kell, ha az update adatai hiányosak (undefined mezők)', async () => {
      const partialData = { description: undefined };
      serviceLogModel.update.mockResolvedValue({ service_id: 1, description: null });

      const result = await serviceLogService.updateService(1, partialData);
      
      expect(result.description).toBeNull();
    });
  });

  describe('getServiceById - Edge Cases', () => {
    it('kezelnie kell a negatív ID-kat vagy nem-szám formátumokat', async () => {
      serviceLogModel.findById.mockResolvedValue(null);

      const result = await serviceLogService.getServiceById(-5);

      expect(result).toBeNull();
      expect(serviceLogModel.findById).toHaveBeenCalledWith(-5);
    });
  });

  describe('deleteService - Edge Cases', () => {
    it('false-t kell adnia, ha a törlés nem érintett sort (már törölték)', async () => {
      serviceLogModel.remove.mockResolvedValue(false);

      const result = await serviceLogService.deleteService(123);

      expect(result).toBe(false);
      expect(serviceLogModel.remove).toHaveBeenCalledWith(123);
    });
  });
});