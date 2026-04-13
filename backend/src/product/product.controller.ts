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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shop/products')
@UseGuards(TokenGuard, RolesGuard)
@Roles('SHOP')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.productService.findByShop(req.user.id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 3, { storage: memoryStorage() }))
  create(
    @Req() req: any,
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(req.user.id, dto, files);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.productService.remove(req.user.id, id);
  }
}
