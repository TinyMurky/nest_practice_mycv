import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/users/users.service';
import { MockType, repositoryMockFactory } from '@/libs/mock_repo';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
/**
 * Info: (20241005 - Murky)
 * Mock Repository
 * https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing
 * https://medium.com/@salmon.3e/integration-testing-with-nestjs-and-typeorm-2ac3f77e7628
 */
describe('UsersService', () => {
  let service: UsersService;
  let repoMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repoMock = module.get(getRepositoryToken(User));

    // Info: (20241005 - Murky) Mock function
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'test',
    } as User;

    repoMock.create.mockReturnValue(mockUser);
    repoMock.save.mockReturnValue(mockUser);
    repoMock.findOneBy.mockReturnValue(mockUser);
    repoMock.find.mockReturnValue([mockUser]);
    repoMock.remove.mockReturnValue(mockUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      const user = await service.create('test@test.com', 'test');
      expect(user).toBeDefined();
      expect(repoMock.create).toHaveBeenCalled();
      expect(repoMock.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should find one by id', async () => {
      const user = await service.findOneById(1);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(user).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('should find by email', async () => {
      const user = await service.findByEmail('test@test.com');

      expect(repoMock.find).toHaveBeenCalledWith({
        where: {
          email: 'test@test.com',
        },
      });

      expect(user.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('update', () => {
    it('should throw error when id is not found', async () => {
      // 直接Mock 同一個class裡的function
      service.findOneById = () => Promise.resolve(null);
      await expect(
        service.update(1, {
          email: 'test2@test.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return user');
  });
});
