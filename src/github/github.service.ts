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
    // Extended metadata (optional)
    repository_full_name?: string;
    repository_stars?: number;
    repository_forks?: number;
    repository_pushed_at?: string;
    repository_archived?: boolean;
    owner_login?: string;
    owner_followers?: number;
    maintenance?: {
        activeRecently: boolean;
        score: number; // 0-100
        notes?: string[];
    }
}

@Injectable()
export class GithubService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private readonly githubApiUrl = 'https://api.github.com';

    async getGoodFirstIssues({
        language,
        topic,
        minStars,
        minForks,
        minOwnerFollowers,
        activeWithinDays,
    }: {
        language?: string,
        topic?: string,
        minStars?: number,
        minForks?: number,
        minOwnerFollowers?: number,
        activeWithinDays?: number,
    }): Promise<GithubIssue[]> {
        // Filter for open issues with the label "good first issue" and ensure we search only issues
        const queryParts: string[] = [
            `is:issue`,
            `label:"good first issue"`,
            `state:open`,
        ];
        if (language) queryParts.push(`language:${language}`);
        if (topic) {
            const topicValue = topic.includes(' ') ? `"${topic}"` : topic;
            queryParts.push(`topic:${topicValue}`);
        }
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

            const issues: GithubIssue[] = response.data.items.map((item: any) => ({
                title: item.title,
                url: item.html_url,
                repository: item.repository_url,
                created_at: item.created_at,
                labels: item.labels.map((label: any) => label.name),
            }));

            // Collect unique repos and owners to fetch metadata
            const uniqueRepoApiUrls = Array.from(new Set(issues.map(i => i.repository)));

            // Fetch repository metadata
            const repoMetaMap = new Map<string, any>(); // key: repo API URL -> repo data
            await Promise.all(uniqueRepoApiUrls.map(async (repoApiUrl) => {
                try {
                    const repoRes = await firstValueFrom(this.httpService.get(repoApiUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github+json'
                        }
                    }));
                    repoMetaMap.set(repoApiUrl, repoRes.data);
                } catch (_) {
                    // ignore repo fetch failures; we'll just skip extended info for those
                }
            }));

            // Fetch owner followers counts (deduped)
            const uniqueOwners = Array.from(new Set(
                Array.from(repoMetaMap.values()).map((r: any) => r?.owner?.login).filter(Boolean)
            ));
            const ownerFollowersMap = new Map<string, number>();
            await Promise.all(uniqueOwners.map(async (ownerLogin) => {
                const userUrl = `${this.githubApiUrl}/users/${ownerLogin}`;
                try {
                    const userRes = await firstValueFrom(this.httpService.get(userUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github+json'
                        }
                    }));
                    ownerFollowersMap.set(ownerLogin, userRes.data?.followers ?? 0);
                } catch (_) {
                    ownerFollowersMap.set(ownerLogin, 0);
                }
            }));

            const daysWindow = activeWithinDays ?? 180;
            const now = Date.now();
            const msWindow = daysWindow * 24 * 60 * 60 * 1000;

            // Enrich issues with repo/owner data and maintenance score
            const enriched = issues.map((issue) => {
                const repo = repoMetaMap.get(issue.repository);
                if (!repo) return issue;
                const pushedAt = repo.pushed_at ? new Date(repo.pushed_at).toISOString() : undefined;
                const activeRecently = pushedAt ? (now - new Date(pushedAt).getTime()) <= msWindow : false;

                const stars = repo.stargazers_count ?? 0;
                const forks = repo.forks_count ?? 0;
                const archived = !!repo.archived;

                const ownerLogin: string | undefined = repo?.owner?.login;
                const followers = ownerLogin ? (ownerFollowersMap.get(ownerLogin) ?? 0) : 0;

                // Simple maintenance scoring heuristic (0-100)
                const notes: string[] = [];
                let score = 0;
                if (activeRecently) { score += 40; notes.push('recently updated'); }
                if (stars >= 50) { score += 20; notes.push('popular (stars)'); }
                if (forks >= 10) { score += 15; notes.push('community forks'); }
                if (followers >= 50) { score += 15; notes.push('owner has followers'); }
                if (!archived) { score += 10; } else { notes.push('archived'); }
                if (score > 100) score = 100;

                return {
                    ...issue,
                    repository_full_name: repo.full_name,
                    repository_stars: stars,
                    repository_forks: forks,
                    repository_pushed_at: pushedAt,
                    repository_archived: archived,
                    owner_login: ownerLogin,
                    owner_followers: followers,
                    maintenance: {
                        activeRecently,
                        score,
                        notes,
                    }
                } as GithubIssue;
            });

            // Apply filters if provided
            const filtered = enriched.filter((it) => {
                if (typeof minStars === 'number' && (it.repository_stars ?? 0) < minStars) return false;
                if (typeof minForks === 'number' && (it.repository_forks ?? 0) < minForks) return false;
                if (typeof minOwnerFollowers === 'number' && (it.owner_followers ?? 0) < minOwnerFollowers) return false;
                if (typeof activeWithinDays === 'number') {
                    if (!it.maintenance?.activeRecently) return false;
                }
                return true;
            });

            return filtered;
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred while fetching issues';
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
    }
}
