import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EventsService {
  private prisma = new PrismaClient();

  // 1. Create Event
  create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        status: 'PENDING',
      },
    });
  }

  // 2. List All Events
  findAll() {
    return this.prisma.event.findMany();
  }

  // 3. GET ONE EVENT (This is what was missing/broken!)
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) throw new NotFoundException(`Event #${id} not found`);
    return event;
  }
}
