import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the login dto', async () => {
      const loginDto = { username: 'testuser', password: 'password' };
      const expectedResult = { access_token: 'token', user: { id: 1, username: 'testuser', role: 'user' } };
      
      mockAuthService.login.mockResolvedValue(expectedResult);
      
      const result = await controller.login(loginDto);
      
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('register', () => {
    it('should call authService.register with the register dto', async () => {
      const registerDto = { username: 'newuser', password: 'password', role: 'user' };
      const expectedResult = { id: 1, username: 'newuser', role: 'user' };
      
      mockAuthService.register.mockResolvedValue(expectedResult);
      
      const result = await controller.register(registerDto);
      
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { id: 1, username: 'testuser', role: 'user' } };
      
      const result = controller.getProfile(req);
      
      expect(result).toEqual(req.user);
    });
  });
});
