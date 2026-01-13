import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  candidateId: string;

  @IsNotEmpty()
  @IsObject()
  breakdown: Record<string, number>; // e.g., { "Voice": 48, "Stage Presence": 30 }
}