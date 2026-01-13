import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createScoreDto: CreateScoreDto) {
    // FIX: We extract the 'userId' from the logged-in user (req.user)
    // and pass it as the first argument.
    const userId = req.user.userId || req.user.id; 
    return this.scoresService.create(userId, createScoreDto);
  }

  // PUBLIC: Leaderboard
  @Get('leaderboard/:eventId')
  getLeaderboard(@Param('eventId') eventId: string) {
    return this.scoresService.getLeaderboard(eventId);
  }
}
