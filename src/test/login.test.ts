import { UserService } from "../service/user.service";
import { Database } from "../Data/database";
import { HashAndComparePasswordUtil } from "../utils/hash-password.util";
import jwt from 'jsonwebtoken';
import { UserEntity } from '../Data/models/user.entity';


jest.mock('../Data/database');
jest.mock('../utils/hash-password.util');
jest.mock('jsonwebtoken');

describe('UserService', () => {
    let service: UserService;
    let mockSign: jest.Mock;
    let mockFindOneBy: jest.Mock;
    let mockGetRepository: jest.Mock;
  
    beforeEach(() => {
      mockSign = jest.fn();
      (jwt.sign as jest.Mock) = mockSign;
  
      mockFindOneBy = jest.fn();
      
      mockGetRepository = jest.fn().mockReturnValue({ findOneBy: mockFindOneBy }) as jest.Mock;
  
      (Database.getInstance as jest.Mock) = jest.fn().mockReturnValue({
        getRepository: mockGetRepository,
      });
  
      service = new UserService();
  
      (HashAndComparePasswordUtil.comparePassword as jest.Mock) = jest.fn();
    });
  
    test('should return user and token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: UserEntity = { id: 1, email, password: 'hashedPassword' } as UserEntity;
      const token = 'jwtToken';
  
      mockFindOneBy.mockResolvedValue(user);
      (HashAndComparePasswordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      mockSign.mockReturnValue(token);
  
      const result = await service.login(email, password);
  
      expect(result).toEqual({ user, token });
      expect(mockGetRepository).toHaveBeenCalledWith(UserEntity);
      expect(mockFindOneBy).toHaveBeenCalledWith({ email });
      expect(HashAndComparePasswordUtil.comparePassword).toHaveBeenCalledWith(password, user.password);
      expect(mockSign).toHaveBeenCalledWith({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });
  
    test('should return null if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';
  
      mockFindOneBy.mockResolvedValue(null);
  
      const result = await service.login(email, password);
  
      expect(result).toBeNull();
      expect(mockGetRepository).toHaveBeenCalledWith(UserEntity);
      expect(mockFindOneBy).toHaveBeenCalledWith({ email });
    });
  
    test('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: UserEntity = { id: 1, email, password: 'hashedPassword' } as UserEntity;
  
      mockFindOneBy.mockResolvedValue(user);
      (HashAndComparePasswordUtil.comparePassword as jest.Mock).mockResolvedValue(false);
  
      const result = await service.login(email, password);
      expect(result).toBeNull();
      expect(mockGetRepository).toHaveBeenCalledWith(UserEntity);
      expect(mockFindOneBy).toHaveBeenCalledWith({ email });
      expect(HashAndComparePasswordUtil.comparePassword).toHaveBeenCalledWith(password, user.password);
    });
  });