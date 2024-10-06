import { Test } from '@nestjs/testing';
import { AuthService } from '@/users/auth.service';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  // Info: (20241004 - Murky) 把 fakeUserService提出來，其他測試才能去覆蓋fake的function
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    /**
     * Info: (20241004 - Murky)
     * Create a fake copy of the user service
     */
    // fakeUsersService = {
    //   // Info: (20241004 - Murky) 這裡findByEmail裡面不填入email:string也可以
    //   findByEmail: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({
    //       id: 1,
    //       email,
    //       password,
    //     } as User),
    // };

    const users: User[] = [];

    fakeUsersService = {
      findByEmail: (email: string) => {
        const foundUsers = users.filter((user) => user.email === email);
        return Promise.resolve(foundUsers);
      },
      create: (email: string, password: string) => {
        const newUser = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(newUser);

        return Promise.resolve(newUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should can create instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create user with hash and salt user', async () => {
      const userCreated = await service.signUp({
        email: 'test@test.com',
        password: 'test',
      });

      expect(userCreated).toBeDefined();
      expect(userCreated.password).not.toBe('test');

      const [hash, salt] = userCreated.password.split('.');
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
      fakeUsersService.findByEmail = () =>
        Promise.resolve([
          {
            id: 1,
            email: 'test@test.com',
            password: 'password',
          } as User,
        ]);

      await expect(
        service.signUp({
          email: 'test@test.com',
          password: 'test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signin', () => {
    it('should throw error if no user found', async () => {
      // Info: (20241005 - Murky) 其實不用再重新覆蓋一次，因為會用Before Each 裡面的
      fakeUsersService.findByEmail = () => Promise.resolve([]);

      await expect(
        service.signIn({
          email: 'test@test.com',
          password: 'test',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden when password not match', async () => {
      fakeUsersService.findByEmail = () =>
        Promise.resolve([
          {
            id: 1,
            email: 'test@test.com',
            password: 'test.test',
          } as User,
        ]);

      await expect(
        service.signIn({
          email: 'test@test.com',
          password: 'test2',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should pass when user is actually signup', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'test',
      };
      await service.signUp(mockUser);

      const user = await service.signIn(mockUser);
      expect(user).toBeDefined();
    });
  });
});
