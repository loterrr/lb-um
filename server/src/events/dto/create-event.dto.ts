import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  type: EventType; // 'SPORT' or 'SOCIO'

  @IsNotEmpty()
  @IsString()
  seasonId: string; // The ID of the season this belongs to

  @IsObject()
  config: Record<string, any>; // The JSON rules (criteria or bracket type)
}