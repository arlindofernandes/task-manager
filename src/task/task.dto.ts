import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum TaskStatusEnum {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TaskDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ type: String, minLength: 3, maxLength: 256 })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  title: string;

  @ApiProperty({ type: String, minLength: 3, maxLength: 512 })
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  description: string;

  @ApiPropertyOptional({ enum: TaskStatusEnum })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: string;
}

export interface findAllParameters {
  title: string;
  status: string;
}

export class TaskRouterParameters {
  @IsUUID()
  id: string;
}
