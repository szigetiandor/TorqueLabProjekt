const servicePartService = require('../../src/services/servicePart.service');
const servicePartModel = require('../../src/models/servicePart.model');
const partModel = require('../../src/models/part.model');

jest.mock('../../src/models/servicePart.model');
jest.mock('../../src/models/part.model'); 

describe('ServicePart Service - Készletkezelés és Logikai tesztek', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createServicePart (Készletkezeléssel)', () => {
        const mockPart = {
            part_id: 10,
            name: 'Turbocharger',
            stock_quantity: 5,
            price: 150000
        };

        it('hibát kell dobnia, ha nincs elég készlet', async () => {
            
            partModel.findById.mockResolvedValue(mockPart);
            
            const data = { 
                service_id: 1, 
                part_id: 10, 
                quantity: 10, 
                unit_price: 150000 
            };

            await expect(servicePartService.createServicePart(data))
                .rejects.toThrow(/Nincs elég készleten/);
            
            
            expect(servicePartModel.create).not.toHaveBeenCalled();
            expect(partModel.update).not.toHaveBeenCalled();
        });

        it('sikeresen le kell vonnia a készletet és rögzíteni az alkatrészt', async () => {
            partModel.findById.mockResolvedValue(mockPart);
            servicePartModel.create.mockResolvedValue({ service_part_id: 1, ...mockPart });

            const data = { 
                service_id: 1, 
                part_id: 10, 
                quantity: 2, 
                unit_price: 150000 
            };

            const result = await servicePartService.createServicePart(data);

            
            
            expect(partModel.update).toHaveBeenCalledWith(10, expect.objectContaining({
                stock_quantity: 3
            }));

            
            expect(servicePartModel.create).toHaveBeenCalledWith(data);
            expect(result).toBeDefined();
        });

        it('hibát kell dobnia, ha az alkatrész nem létezik', async () => {
            partModel.findById.mockResolvedValue(null);

            const data = { part_id: 999, quantity: 1, unit_price: 100 };

            await expect(servicePartService.createServicePart(data))
                .rejects.toThrow("A választott alkatrész nem található!");
        });
    });

    describe('Logikai Edge Case-ek', () => {
        const existingPart = {
            part_id: 1,
            name: 'Test Part',
            stock_quantity: 100,
            price: 5000
        };

        it('hibát kell dobnia, ha a mennyiség negatív', async () => {
            
            partModel.findById.mockResolvedValue(existingPart);

            const badData = { 
                part_id: 1, 
                quantity: -1, 
                unit_price: 100 
            };
            
            await expect(servicePartService.createServicePart(badData))
                .rejects.toThrow("A mennyiségnek nagyobbnak kell lennie 0-nál!");
            
            
            expect(servicePartModel.create).not.toHaveBeenCalled();
        });
    });

    describe('getServicePartById', () => {
        it('hibát kell dobnia, ha nem létezik az ID', async () => {
            servicePartModel.findById.mockResolvedValue(null);

            await expect(servicePartService.getServicePartById(999))
                .rejects.toThrow("A keresett szerviz-alkatrész nem található!");
        });
    });

    describe('deleteServicePart', () => {
        it('sikeresen visszaadja a true értéket, ha a törlés megtörtént', async () => {
            servicePartModel.remove.mockResolvedValue(true);

            const result = await servicePartService.deleteServicePart(123);
            expect(result).toBe(true);
            expect(servicePartModel.remove).toHaveBeenCalledWith(123);
        });
    });
});