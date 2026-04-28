import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';

describe('SessionsService', () => {
  let service: SessionsService;
  let repo: any;

  const mockSession: Session = {
    id: 'session-uuid', userId: 'user-uuid', token: 'token-value',
    expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
  } as Session;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService, { provide: getRepositoryToken(Session), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), delete: jest.fn() } }],
    }).compile();
    service = module.get<SessionsService>(SessionsService);
    repo = module.get(getRepositoryToken(Session));
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('create', () => {
    it('should create session', async () => {
      const dto = { userId: 'user-uuid', token: 'token-value', expiresAt: new Date() };
      jest.spyOn(repo, 'save').mockResolvedValue(mockSession);
      const result = await service.create(dto);
      expect(result).toBeDefined();
    });
  });

  describe('findAllBy', () => {
    it('should filter by userId', async () => {
      repo.find = jest.fn().mockResolvedValue([mockSession]);
      await service.findAllBy({ userId: 'user-uuid' });
      expect(repo.find).toHaveBeenCalled();
    });
  });
});