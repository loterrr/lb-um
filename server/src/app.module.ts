import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module'; // <--- Import this
import { ScoresModule } from './scores/scores.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    ScoresModule,
    UsersModule,
    CandidatesModule, // <--- Add this to the list
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
