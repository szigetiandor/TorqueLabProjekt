const userService = require('../../src/services/user.service');
const userModel = require('../../src/models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service - Biztonsági és Edge Case tesztek', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
    });

    describe('createUser', () => {
        it('hibát kell dobnia, ha a jelszó túl rövid', async () => {
            const userData = { name: 'Teszt', email: 't@t.hu', password: '123' };
            
            await expect(userService.createUser(userData))
                .rejects.toThrow("A jelszónak legalább 6 karakternek kell lennie!");
        });

        it('meg kell akadályoznia a duplikált regisztrációt', async () => {
            userModel.findByEmail.mockResolvedValue({ id: 1, email: 'exists@test.hu' });
            
            await expect(userService.createUser({ email: 'exists@test.hu', password: 'password123' }))
                .rejects.toThrow("Ez az email cím már foglalt!");
        });
    });

    describe('loginUser', () => {
        it('null-t kell visszaadnia, ha a jelszó nem egyezik', async () => {
            userModel.findByEmail.mockResolvedValue({ _password_hash: 'hashed_pass', toJSON: () => ({}) });
            bcrypt.compare.mockResolvedValue(false); 

            const result = await userService.loginUser('test@test.hu', 'wrong_pass');
            
            expect(result).toBeNull();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('generálnia kell tokent sikeres login esetén', async () => {
            const mockUser = { _password_hash: 'hash', toJSON: () => ({ id: 1 }) };
            userModel.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock_token');

            const result = await userService.loginUser('test@test.hu', 'correct_pass');

            expect(result.token).toBe('mock_token');
            expect(result.user).toBeDefined();
        });
    });

    describe('updateUser', () => {
        it('hibát kell dobnia, ha nem létező felhasználót módosítanánk', async () => {
            userModel.findById.mockResolvedValue(null);

            await expect(userService.updateUser(99, { name: 'Új' }))
                .rejects.toThrow("Felhasználó nem található!");
        });
    });
});