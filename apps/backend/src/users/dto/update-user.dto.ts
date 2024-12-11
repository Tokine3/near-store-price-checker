import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserNameDto extends PickType(PartialType(CreateUserDto), [
  'name',
] as const) {}
