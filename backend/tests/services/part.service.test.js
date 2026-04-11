const partService = require('../../src/services/part.service');
const partModel = require('../../src/models/part.model');


jest.mock('../../src/models/part.model');

describe('Part Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPart', () => {
        it('meghívja a modell create függvényét a helyes adatokkal', async () => {
            const partData = { name: 'Féktárcsa', price: 15000 };
            partModel.create.mockResolvedValue({ part_id: 1, ...partData });

            const result = await partService.createPart(partData);

            expect(partModel.create).toHaveBeenCalledWith(partData);
            expect(result.part_id).toBe(1);
        });
    });

    describe('getAllParts', () => {
        it('továbbítja a keresési feltételeket a modellnek', async () => {
            const mockParts = [{ part_id: 1, name: 'Olajszűrő' }];
            partModel.findAll.mockResolvedValue(mockParts);

            const result = await partService.getAllParts('bosch', 5000);

            
            expect(partModel.findAll).toHaveBeenCalledWith('bosch', 5000);
            expect(result).toEqual(mockParts);
        });

        it('helyesen kezeli, ha nincsenek szűrők', async () => {
            await partService.getAllParts();
            expect(partModel.findAll).toHaveBeenCalledWith(undefined, undefined);
        });
    });

    describe('getPartById', () => {
        it('visszaadja a konkrét alkatrészt', async () => {
            const mockPart = { part_id: 10, name: 'Gyertya' };
            partModel.findById.mockResolvedValue(mockPart);

            const result = await partService.getPartById(10);

            expect(partModel.findById).toHaveBeenCalledWith(10);
            expect(result.name).toBe('Gyertya');
        });
    });

    describe('updatePart', () => {
        it('meghívja a modell update metódusát az ID-val és az adatokkal', async () => {
            const updateData = { stock_quantity: 20 };
            partModel.update.mockResolvedValue({ part_id: 1, ...updateData });

            const result = await partService.updatePart(1, updateData);

            expect(partModel.update).toHaveBeenCalledWith(1, updateData);
            expect(result.stock_quantity).toBe(20);
        });
    });

    describe('deletePart', () => {
        it('meghívja a remove metódust és visszaadja a sikert jelző boolean-t', async () => {
            partModel.remove.mockResolvedValue(true);

            const result = await partService.deletePart(99);

            expect(partModel.remove).toHaveBeenCalledWith(99);
            expect(result).toBe(true);
        });
    });

    describe('Part Service - Edge Cases', () => {
        it('kezelnie kell, ha a maxPrice negatív szám (üzleti logika)', async () => {
            
            
            partModel.findAll.mockResolvedValue([]);

            const result = await partService.getAllParts('olaj', -100);

            
            expect(partModel.findAll).toHaveBeenCalledWith('olaj', -100);
        });

        it('kezelnie kell a speciális karaktereket a keresőben', async () => {
            const specialChars = "!@#$%^&*()_+";
            partModel.findAll.mockResolvedValue([]);

            await partService.getAllParts(specialChars, null);

            expect(partModel.findAll).toHaveBeenCalledWith(specialChars, null);
        });
    });
});

