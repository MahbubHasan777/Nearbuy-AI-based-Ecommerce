import { IsString, MaxLength } from 'class-validator';

export class ShopMessageDto {
  @IsString()
  @MaxLength(500)
  bannerMsg: string;
}
