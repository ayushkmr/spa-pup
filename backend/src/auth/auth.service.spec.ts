import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data when credentials are valid', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      const loginDto = { username: 'testuser', password: 'password' };
      const token = 'jwt-token';

      // Mock validateUser to return a user (success case)
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: user.id,
        username: user.username,
        role: user.role
      });
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
        role: user.role
      });

      expect(result).toEqual({
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = { username: 'nonexistent', password: 'password' };

      // Mock validateUser to return null (user not found or invalid password)
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpassword' };

      // Mock validateUser to return null (user not found or invalid password)
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });
  });

  describe('register', () => {
    it('should create a new user and return user data', async () => {
      const registerDto = { username: 'newuser', password: 'password', role: 'user' };
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: 1, username: 'newuser', password: hashedPassword, role: 'user' };

      // Mock user check to return null (user doesn't exist)
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: registerDto.username },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        username: registerDto.username,
        password: hashedPassword,
        role: registerDto.role,
      });

      expect(result).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        role: createdUser.role,
      });
    });

    it('should throw UnauthorizedException when username already exists', async () => {
      const registerDto = { username: 'existinguser', password: 'password', role: 'user' };
      const existingUser = { id: 1, username: 'existinguser', password: 'hashedPassword', role: 'user' };

      // Mock user check to return an existing user
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: registerDto.username },
      });
    });
  });
});
