import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  const mockUser: User = {
    id: 'user-uuid', email: 'test@example.com', name: 'Test User', emailVerified: false,
    password: null, avatar: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } }],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('create', () => {
    it('should create user', async () => {
      const dto = { email: 'test@example.com', name: 'Test' };
      jest.spyOn(repo, 'save').mockResolvedValue(mockUser);
      const result = await service.create(dto);
      expect(result).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      repo.findOne = jest.fn().mockResolvedValue(mockUser);
      const result = await service.findOne('user-uuid');
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      repo.findOne = jest.fn().mockResolvedValue(mockUser);
      repo.update = jest.fn().mockResolvedValue({ affected: 1 });
      await service.update('user-uuid', { name: 'Updated Name' });
      expect(repo.update).toHaveBeenCalled();
    });
  });
});