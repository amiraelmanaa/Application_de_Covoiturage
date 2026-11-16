import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings') // all routes here start with /bookings
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post() // POST /bookings
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }
}