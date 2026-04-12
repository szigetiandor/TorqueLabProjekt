const servicePartController = require("../../src/controllers/servicePart.controller");
const servicePartService = require("../../src/services/servicePart.service");

// Szerviz réteg mockolása
jest.mock("../../src/services/servicePart.service");

describe("ServicePartController Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    // Express kérés és válasz objektumok inicializálása
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    // A console.log elnyomása a tesztek futása alatt
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  // --- createServicePart ---
  describe("createServicePart", () => {
    test("Sikeres létrehozás (201)", async () => {
      const mockInput = { service_id: 1, part_id: 10, quantity: 2, unit_price: 5000 };
      req.body = mockInput;
      servicePartService.createServicePart.mockResolvedValue({ id: 100, ...mockInput });

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockInput));
    });

    test("Hiba: Hiányzó kötelező mezők (400)", async () => {
      req.body = { service_id: 1 }; // part_id, quantity, unit_price hiányzik

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
      expect(servicePartService.createServicePart).not.toHaveBeenCalled();
    });

    test("Hiba: Szerver hiba (500)", async () => {
      req.body = { service_id: 1, part_id: 10, quantity: 2, unit_price: 5000 };
      servicePartService.createServicePart.mockRejectedValue(new Error("Database failure"));

      await servicePartController.createServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database failure" });
    });
  });

  // --- getAllServiceParts ---
  describe("getAllServiceParts", () => {
    test("Sikeres lekérés (200)", async () => {
      const mockList = [{ id: 1 }, { id: 2 }];
      servicePartService.getAllServiceParts.mockResolvedValue(mockList);

      await servicePartController.getAllServiceParts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockList);
    });

    test("Hiba: Szerver hiba (500)", async () => {
      servicePartService.getAllServiceParts.mockRejectedValue(new Error("Internal error"));

      await servicePartController.getAllServiceParts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- getServicePartById ---
  describe("getServicePartById", () => {
    test("Sikeres lekérés ID alapján (200)", async () => {
      req.params.id = "1";
      servicePartService.getServicePartById.mockResolvedValue({ id: 1, part_id: 5 });

      await servicePartController.getServicePartById(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    test("Hiba: A rekord nem található (404)", async () => {
      req.params.id = "999";
      servicePartService.getServicePartById.mockResolvedValue(null);

      await servicePartController.getServicePartById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "ServicePart not found" });
    });
  });

  // --- updateServicePart ---
  describe("updateServicePart", () => {
    const updateData = { service_id: 1, part_id: 2, quantity: 5, unit_price: 1500 };

    test("Sikeres frissítés (200)", async () => {
      req.params.id = "1";
      req.body = updateData;
      servicePartService.updateServicePart.mockResolvedValue({ id: 1, ...updateData });

      await servicePartController.updateServicePart(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(servicePartService.updateServicePart).toHaveBeenCalledWith("1", updateData);
    });

    test("Hiba: Hiányzó mező frissítéskor (400)", async () => {
      req.params.id = "1";
      req.body = { quantity: 10 }; // A többi mező hiányzik

      await servicePartController.updateServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("Hiba: Frissítendő rekord nem található (404)", async () => {
      req.params.id = "999";
      req.body = updateData;
      servicePartService.updateServicePart.mockResolvedValue(null);

      await servicePartController.updateServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // --- deleteServicePart ---
  describe("deleteServicePart", () => {
    test("Sikeres törlés (200)", async () => {
      req.params.id = "1";
      servicePartService.deleteServicePart.mockResolvedValue({ success: true });

      await servicePartController.deleteServicePart(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    test("Hiba: Törlendő rekord nem található (404)", async () => {
      req.params.id = "999";
      servicePartService.deleteServicePart.mockResolvedValue(null);

      await servicePartController.deleteServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("Hiba: Szerver hiba törléskor (500)", async () => {
      req.params.id = "1";
      servicePartService.deleteServicePart.mockRejectedValue(new Error("Delete failed"));

      await servicePartController.deleteServicePart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});