import { PartialType } from '@nestjs/mapped-types';
import { CreateAdSpendingDto } from './create-ad-spending.dto';

export class UpdateAdSpendingDto extends PartialType(CreateAdSpendingDto) {}
