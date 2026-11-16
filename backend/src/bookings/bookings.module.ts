import { Module } from '@nestjs/common';
import { JourneysModule } from '../journeys/journeys.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';

@Module({
  imports: [JourneysModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
})
export class BookingsModule {}