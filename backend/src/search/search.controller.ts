import { Controller, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('search')
@UseGuards(TokenGuard, RolesGuard)
@Roles('CUSTOMER')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query('q') q: string, @Query() params: any, @Req() req: any) {
    return this.searchService.search(q || '', req.user.id, params);
  }

  @Get('shop/:shopId')
  searchInShop(
    @Param('shopId') shopId: string,
    @Query('q') q: string,
    @Query() params: any,
  ) {
    return this.searchService.searchInShop(shopId, q || '', params);
  }
}
