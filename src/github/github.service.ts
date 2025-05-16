import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface GithubIssue {
    title: string;
    url: string;
    repository: string;
    created_at: string;
    labels: string[];
}

@Injectable()
export class GithubService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private readonly githubApiUrl = 'https://api.github.com';

    async getGoodFirstIssues({ language, topic }: { language: string, topic: string }): Promise<GithubIssue[]> {
        const queryParts: string[] = [`label:good-first-issue`, `state:open`]; // Filter for open issues with the label "good first issue"
        if (language) queryParts.push(`language:${language}`);
        if (topic) queryParts.push(`topic:${topic}`);
        const query = queryParts.join(' ');
        const url = `${this.githubApiUrl}/search/issues?q=${encodeURIComponent(query)}`;

        try {
            const token = this.configService.get<string>('GITHUB_TOKEN');
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github+json'
                    }
                }),
            );

            return response.data.items.map((item: any) => ({
                title: item.title,
                url: item.html_url,
                repository: item.repository_url,
                created_at: item.created_at,
                labels: item.labels.map((label: any) => label.name)
            }))
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred while fetching issues';
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
    }
}
