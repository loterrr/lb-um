import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ScoresService {
  private prisma = new PrismaClient();

  // 1. Submit a Score
  async create(userId: string, createScoreDto: CreateScoreDto) {
    const { eventId, candidateId, breakdown } = createScoreDto;

    // Fetch Event to get the Rules (Config)
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    // Validate Scores against Criteria
    const criteria = (event.config as any).criteria || [];
    let calculatedTotal = 0;

    for (const criterion of criteria) {
      const scoreGiven = breakdown[criterion.name] || 0;
      
      if (scoreGiven > criterion.max) {
        throw new BadRequestException(`Score for ${criterion.name} cannot exceed ${criterion.max}`);
      }
      
      calculatedTotal += scoreGiven;
    }

    // Save to Database
    return this.prisma.score.create({
      data: {
        eventId,
        candidateId,
        judgeId: userId,
        breakdown,
        total: calculatedTotal,
      },
    });
  }

  // 2. Get Raw Scores for an Event
  async findAllByEvent(eventId: string) {
    return this.prisma.score.findMany({
      where: { eventId },
      include: { judge: { select: { name: true } } }
    });
  }

  // 3. NEW: Calculate the Leaderboard (Average Scores)
  async getLeaderboard(eventId: string) {
    // Get all scores for this event
    const scores = await this.prisma.score.findMany({
      where: { eventId },
    });

    // Group by Candidate
    const leaderboard: Record<string, { total: number; count: number }> = {};
    
    for (const score of scores) {
      if (!leaderboard[score.candidateId]) {
        leaderboard[score.candidateId] = { total: 0, count: 0 };
      }
      
      leaderboard[score.candidateId].total += score.total;
      leaderboard[score.candidateId].count += 1;
    }

    // Calculate Averages & Sort
    const results = Object.keys(leaderboard).map(candidateId => {
      const data = leaderboard[candidateId];
      return {
        candidateId,
        finalScore: data.total / data.count, // The Average
        judgeCount: data.count
      };
    });

    // Sort descending (Highest score first)
    return results.sort((a, b) => b.finalScore - a.finalScore);
  }
}
