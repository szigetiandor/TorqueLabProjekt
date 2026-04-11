const carService = require('../../src/services/car.service');
const carModel = require('../../src/models/car.model');


jest.mock('../../src/models/car.model');

describe('Car Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCar', () => {
        it('meg kell hívnia a modell create metódusát a megadott adatokkal', async () => {
            const carData = { brand: 'BMW', model: 'M3' };
            carModel.create.mockResolvedValue({ car_id: 1, ...carData });

            const result = await carService.createCar(carData);

            expect(carModel.create).toHaveBeenCalledWith(carData);
            expect(result.car_id).toBe(1);
        });
    });

    describe('getAllCars', () => {
        it('vissza kell adnia az összes autót a szűrők alapján', async () => {
            const mockCars = [{ car_id: 1, model: 'Civic' }];
            carModel.findAll.mockResolvedValue(mockCars);

            const result = await carService.getAllCars('Civic', 'Sedan');

            expect(carModel.findAll).toHaveBeenCalledWith('Civic', 'Sedan');
            expect(result).toEqual(mockCars);
        });
    });

    describe('getCarById', () => {
        it('vissza kell adnia egy autót ID alapján', async () => {
            const mockCar = { car_id: 5, brand: 'Audi' };
            carModel.findById.mockResolvedValue(mockCar);

            const result = await carService.getCarById(5);

            expect(carModel.findById).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockCar);
        });
    });

    describe('updateCar', () => {
        it('frissítenie kell az autót az új adatokkal', async () => {
            const updateData = { price: 5000000 };
            carModel.update.mockResolvedValue({ car_id: 1, ...updateData });

            const result = await carService.updateCar(1, updateData);

            expect(carModel.update).toHaveBeenCalledWith(1, updateData);
            expect(result.price).toBe(5000000);
        });
    });

    describe('deleteCar', () => {
        it('true-t kell visszaadnia, ha a törlés sikeres volt', async () => {
            carModel.remove.mockResolvedValue(true);

            const result = await carService.deleteCar(1);

            expect(carModel.remove).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });

    describe('Car Service - Edge Cases', () => {
        it('findById: kezelnie kell, ha az ID nem szám, hanem szöveg', async () => {
            
            carModel.findById.mockResolvedValue(null);

            const result = await carService.getCarById("nem-szam-id");

            expect(carModel.findById).toHaveBeenCalledWith("nem-szam-id");
            expect(result).toBeNull();
        });

        it('createCar: nagyon nagy adathalmaz kezelése', async () => {
            const longString = "A".repeat(10000); 
            const data = { brand: longString, model: 'Test' };
            carModel.create.mockResolvedValue(data);

            const result = await carService.createCar(data);
            expect(result.brand.length).toBe(10000);
        });
    });
});

