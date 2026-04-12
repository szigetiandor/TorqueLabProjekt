const servicePartService = require('../../src/services/servicePart.service');
const servicePartModel = require('../../src/models/servicePart.model');

jest.mock('../../src/models/servicePart.model');

describe('ServicePart Service - Logikai és Edge Case tesztek', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createServicePart', () => {
        it('hibát kell dobnia, ha a mennyiség negatív', async () => {
            const badData = { quantity: -1, unit_price: 100 };
            
            await expect(servicePartService.createServicePart(badData))
                .rejects.toThrow("A mennyiségnek nagyobbnak kell lennie 0-nál!");
            
            expect(servicePartModel.create).not.toHaveBeenCalled();
        });

        it('hibát kell dobnia, ha az ár negatív', async () => {
            const badData = { quantity: 1, unit_price: -500 };
            
            await expect(servicePartService.createServicePart(badData))
                .rejects.toThrow("Az egységár nem lehet negatív!");
        });
    });

    describe('getServicePartById', () => {
        it('hibát kell dobnia, ha a modell null-t ad vissza (nem létező ID)', async () => {
            servicePartModel.findById.mockResolvedValue(null);

            await expect(servicePartService.getServicePartById(999))
                .rejects.toThrow("A keresett szerviz-alkatrész nem található!");
        });

        it('vissza kell adnia az adatot, ha létezik', async () => {
            const mockData = { service_part_id: 1, quantity: 2 };
            servicePartModel.findById.mockResolvedValue(mockData);

            const result = await servicePartService.getServicePartById(1);
            expect(result).toEqual(mockData);
        });
    });

    describe('updateServicePart', () => {
        it('hibát kell dobnia, ha olyan ID-t akarunk frissíteni, ami nincs az adatbázisban', async () => {
            servicePartModel.update.mockResolvedValue(null);

            await expect(servicePartService.updateServicePart(999, { quantity: 5 }))
                .rejects.toThrow("Sikertelen frissítés: a rekord nem létezik!");
        });

        it('meg kell akadályoznia a mennyiség 0-ra módosítását', async () => {
            await expect(servicePartService.updateServicePart(1, { quantity: 0 }))
                .rejects.toThrow("A módosított mennyiségnek pozitívnak kell lennie!");
        });
    });

    describe('deleteServicePart', () => {
        it('hibát kell dobnia, ha a törlés nem érintett sort (false-t ad a modell)', async () => {
            servicePartModel.remove.mockResolvedValue(false);

            await expect(servicePartService.deleteServicePart(123))
                .rejects.toThrow("Sikertelen törlés: a rekord nem található!");
        });

        it('sikeresen visszaadja a true értéket, ha a törlés megtörtént', async () => {
            servicePartModel.remove.mockResolvedValue(true);

            const result = await servicePartService.deleteServicePart(123);
            expect(result).toBe(true);
        });
    });
});