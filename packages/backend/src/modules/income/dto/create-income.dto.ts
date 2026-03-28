import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateIncomeDto {
  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
