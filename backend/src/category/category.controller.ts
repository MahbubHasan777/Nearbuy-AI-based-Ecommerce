import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shop/categories')
@UseGuards(TokenGuard, RolesGuard)
@Roles('SHOP')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.categoryService.findAll(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body('name') name: string) {
    return this.categoryService.create(req.user.id, name);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.categoryService.update(req.user.id, id, name);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.categoryService.remove(req.user.id, id);
  }
}
