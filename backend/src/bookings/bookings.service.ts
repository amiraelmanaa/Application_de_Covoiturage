import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JourneysService } from '../journeys/journeys.service';
import { Booking } from './booking.entity';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly journeysService: JourneysService,
    private readonly bookingsRepo: BookingsRepository,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    // Transaction = all or nothing.
    return this.dataSource.transaction(async (manager) => {
      // 1. Take a seat (throws if none left -> everything is cancelled)
      await this.journeysService.reserveSeat(dto.journeyId, manager);
      // 2. Save the booking
      return this.bookingsRepo.create(dto.journeyId, dto.passengerId, manager);
    });
  }
}