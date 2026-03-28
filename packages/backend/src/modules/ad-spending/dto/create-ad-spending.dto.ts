import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAdSpendingDto {
  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  campaignName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  platform?: string;
}
