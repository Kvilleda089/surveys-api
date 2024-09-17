import { UserService } from "../service/user.service";
import { Database } from "../Data/database";
import { HashAndComparePasswordUtil } from "../utils/hash-password.util";
import jwt from 'jsonwebtoken';
import { UserEntity } from '../Data/models/user.entity';
import { Repository } from "typeorm";


jest.mock('../Data/database');
jest.mock('../utils/hash-password.util');
jest.mock('jsonwebtoken');



const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();


const mockRepository = {
    create: mockCreate,
    save: mockSave,
    findOne: mockFindOne, 
} as unknown as Repository<UserEntity>;


const mockDatabaseInstance = {
    getRepository: jest.fn().mockReturnValue(mockRepository),
} as unknown as Database;


jest.spyOn(Database, 'getInstance').mockReturnValue(mockDatabaseInstance);

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });


    describe('createUser', () => {
        test('should create a user and return it with a token', async () => {
            const email = 'test@example.com';
            const password = 'password';
            const googleId = 'googleId';
            const hashedPassword = 'hashedPassword';
            const token = 'token';
            const newUser = { id: 1, email, password: hashedPassword, googleId } as UserEntity;

           
            (HashAndComparePasswordUtil.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
            mockCreate.mockReturnValue(newUser);
            mockSave.mockResolvedValue(newUser);
            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = await userService.createUser(email, password, googleId);

            expect(result.user).toEqual(newUser);
            expect(result.token).toBe(token);
            expect(HashAndComparePasswordUtil.hashPassword).toHaveBeenCalledWith(password);
            expect(mockSave).toHaveBeenCalledWith(newUser);
        });
    });

    describe('getUserById', () => {
        test('should return a user by ID', async () => {
            const userId = 1;
            const user = { id: userId, email: 'test@example.com' } as UserEntity;

            mockFindOne.mockResolvedValue(user); 

            const result = await userService.getUserById(userId);

            expect(result).toEqual(user);
            expect(mockFindOne).toHaveBeenCalledWith({ where: { id: userId } });
        });

        test('should return null if user is not found', async () => {
            const userId = 1;

            mockFindOne.mockResolvedValue(null); 

            const result = await userService.getUserById(userId);

            expect(result).toBeNull();
            expect(mockFindOne).toHaveBeenCalledWith({ where: { id: userId } }); 
        });
    });
});