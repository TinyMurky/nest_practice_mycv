import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { AuthService } from '@/users/auth.service';
import { User } from '@/users/users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
  } as User;

  beforeEach(async () => {
    // Fake要寫在 Test.createTestingModule
    fakeAuthService = {
      // 可以用MockImplement, 也可以簡寫成mockResolveValue
      // 不一定要用jest.fn()mock, 也可以直接是Promise.resolve(mockUser)
      // 但是用jest.fn()就可以用haveBeenCallWith
      signIn: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
      signUp: jest.fn().mockResolvedValue(mockUser),
    };

    fakeUserService = {
      findOneById: jest.fn().mockResolvedValue(mockUser),
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockImplementation(
        (id: number, attrs: Partial<User>) =>
          new Promise((resolve) => {
            const updatedUser = {
              ...mockUser,
              ...attrs,
            } as User;
            resolve(updatedUser);
          }),
      ),
      remove: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call auth signIn', async () => {
      const user = await controller.signIn({
        email: 'test@test.com',
        password: 'test',
      });

      expect(user).toBeDefined();
      expect(fakeAuthService.signIn).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should use auth signUp and return user', () => {
      const user = controller.signUp({
        email: 'test@test.com',
        password: 'test',
      });

      expect(fakeAuthService.signUp).toHaveBeenCalled();
      expect(user).toBeDefined();
    });
  });
});
