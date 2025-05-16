import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubIssue, GithubService } from './github.service';

describe('GithubController', () => {
  let controller: GithubController;
  let service: GithubService;

  const mockGithubService = {
    getGoodFirstIssues: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [
        {
          provide: GithubService,
          useValue: mockGithubService
        }
      ]
    }).compile();

    controller = module.get<GithubController>(GithubController);
    service = module.get<GithubService>(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return issues from the service', async () => {
    const mockIssues: GithubIssue[] = [
      {
        title: 'Fix typo',
        url: 'https://github.com/me/repo/issues/1',
        repository: 'https://api.github.com/repos/me/repo',
        created_at: '2025-05-16T08:00:00Z',
        labels: [ 'good first issue']
      }
    ];

    mockGithubService.getGoodFirstIssues.mockResolvedValue(mockIssues);

    const result = await controller.getIssues('typescript', 'nestjs');

    expect(service.getGoodFirstIssues).toHaveBeenCalledWith({
      language: 'typescript',
      topic: 'nestjs'
    });
    expect(result).toEqual(mockIssues);
  });

  it('should handle optional query params', async () => {
    mockGithubService.getGoodFirstIssues.mockResolvedValue([]);
    await controller.getIssues(undefined, 'react');
    expect(service.getGoodFirstIssues).toHaveBeenCalledWith({
      language: undefined,
      topic: 'react'
    });
  })
});
