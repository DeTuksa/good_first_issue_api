import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

describe('GithubService', () => {
  let service: GithubService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-github-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {provide: HttpService, useValue: mockHttpService},
        {provide: ConfigService, useValue: mockConfigService}
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of issues on success', async () => {
    const mockIssues = [
      {
        title: 'Fix typo',
        html_url: 'https://github.com/me/repo/issues/1',
        repository_url: 'https://api.github.com/repos/me/repo',
        created_at: '2025-05-16T08:00:00Z',
        labels: [{name: 'good first issue'}]
      },
    ];

    const mockResponse: AxiosResponse = {
      data: {items: mockIssues},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: AxiosHeaders.from({
          Authorization: `Bearer ${configService.get<string>('GITHUB_TOKEN')}`,
          Accept: 'application/vnd.github+json'
        })
      }
    };

    mockHttpService.get.mockReturnValue(of(mockResponse));

    const result = await service.getGoodFirstIssues({language: 'typescript', topic: undefined});

    expect(mockHttpService.get).toHaveBeenCalled();

    expect(result).toEqual([
      {
        title: 'Fix typo',
        url: 'https://github.com/me/repo/issues/1',
        repository: 'https://api.github.com/repos/me/repo',
        created_at: '2025-05-16T08:00:00Z',
        labels: ['good first issue']
      }
    ]);
  });

  it('should throw an HttpException on API error', async () => {
    const mockError = {
      response: {
        data: {message: 'Bad credentials'},
        status: 401
      }
    };

    mockHttpService.get.mockReturnValue(throwError(() => mockError));

    await expect(
      service.getGoodFirstIssues({language: 'typescript', topic: ''}),
    ).rejects.toThrow('Bad credentials');
  });
});
