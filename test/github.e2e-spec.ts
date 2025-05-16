import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GithubModule } from '../src/github/github.module';
import { GithubController } from '../src/github/github.controller';
import { GithubService } from '../src/github/github.service';

describe('GitHubController (e2e)', () => {
  let app: INestApplication;
  let mockGitHubService: Partial<GithubService>;

  beforeAll(async () => {
    mockGitHubService = {
      getGoodFirstIssues: jest.fn().mockResolvedValue([
        {
          title: 'Add dark mode',
          url: 'https://github.com/me/repo/issues/1',
          repository: 'https://api.github.com/repos/me/repo',
          created_at: '2025-05-16T12:00:00Z',
          labels: ['good first issue'],
        },
      ]),
    };

    const moduleFixture = await Test.createTestingModule({
      imports: [GithubModule],
    })
      .overrideProvider(GithubService)
      .useValue(mockGitHubService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/github/issues (GET) returns issues', async () => {
    const response = await request(app.getHttpServer())
      .get('/github/issues')
      .query({ language: 'typescript', topic: 'nestjs' })
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('title', 'Add dark mode');
    expect(mockGitHubService.getGoodFirstIssues).toHaveBeenCalledWith({
      language: 'typescript',
      topic: 'nestjs',
    });
  });

  it('/github/issues (GET) handles missing query params', async () => {
    await request(app.getHttpServer()).get('/github/issues').expect(200);
    expect(mockGitHubService.getGoodFirstIssues).toHaveBeenCalledWith({
      language: undefined,
      topic: undefined,
    });
  });
});
