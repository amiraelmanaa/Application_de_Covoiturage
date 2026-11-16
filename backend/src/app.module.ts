import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneysModule } from './journeys/journeys.module';
import { BookingsModule } from './bookings/bookings.module';
import { Journey } from './journeys/journey.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5433),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'carpooling',
      entities: [Journey, Booking],
      synchronize: true, // auto-creates tables: fine for a prototype
    }),
    JourneysModule,
    BookingsModule,
  ],
})
export class AppModule {}