import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GithubIssue, GithubService } from './github.service';

@ApiTags('GitHub')
@Controller('github')
export class GithubController {
    constructor(
        private readonly gitHubService: GithubService
    ) {}

    @Get('issues')
    @ApiQuery({name: 'language', required: false})
    @ApiQuery({name: 'topic', required: false})
    async getIssues(
        @Query('language') language?: string,
        @Query('topic') topic?: string
    ): Promise<GithubIssue[]> {
        return this.gitHubService.getGoodFirstIssues({language, topic});
    }
}
