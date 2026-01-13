import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get('event/:eventId')
  findAllByEvent(@Param('eventId') eventId: string) {
    return this.candidatesService.findAllByEvent(eventId);
  }
}