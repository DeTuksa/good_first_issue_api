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
    @ApiQuery({name: 'minStars', required: false, type: Number, description: 'Minimum repository stars'})
    @ApiQuery({name: 'minForks', required: false, type: Number, description: 'Minimum repository forks'})
    @ApiQuery({name: 'minOwnerFollowers', required: false, type: Number, description: "Minimum repository owner's followers"})
    @ApiQuery({name: 'activeWithinDays', required: false, type: Number, description: 'Only repos updated within the last N days'})
    async getIssues(
        @Query('language') language?: string,
        @Query('topic') topic?: string,
        @Query('minStars') minStarsRaw?: string,
        @Query('minForks') minForksRaw?: string,
        @Query('minOwnerFollowers') minOwnerFollowersRaw?: string,
        @Query('activeWithinDays') activeWithinDaysRaw?: string,
    ): Promise<GithubIssue[]> {
        const toNum = (v?: string) => (v !== undefined ? Number(v) : undefined);
        const minStars = toNum(minStarsRaw);
        const minForks = toNum(minForksRaw);
        const minOwnerFollowers = toNum(minOwnerFollowersRaw);
        const activeWithinDays = toNum(activeWithinDaysRaw);

        return this.gitHubService.getGoodFirstIssues({
            language,
            topic,
            minStars: Number.isNaN(minStars!) ? undefined : minStars,
            minForks: Number.isNaN(minForks!) ? undefined : minForks,
            minOwnerFollowers: Number.isNaN(minOwnerFollowers!) ? undefined : minOwnerFollowers,
            activeWithinDays: Number.isNaN(activeWithinDays!) ? undefined : activeWithinDays,
        });
    }
}
