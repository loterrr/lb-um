import { Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CandidatesService {
  private prisma = new PrismaClient();

  create(createCandidateDto: CreateCandidateDto) {
    return this.prisma.candidate.create({
      data: createCandidateDto,
    });
  }

  findAllByEvent(eventId: string) {
    return this.prisma.candidate.findMany({
      where: { eventId },
      orderBy: { number: 'asc' },
    });
  }
}
