import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  // 1. Create a new User (Judge or Admin)
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Remove 'password' from the result we send back
    const { password, ...result } = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return result;
  }

  // 2. List all Judges
  findAllJudges() {
    return this.prisma.user.findMany({
      where: { role: 'JUDGE' },
      select: { id: true, username: true, name: true, role: true }, // Don't select password!
    });
  }
}
