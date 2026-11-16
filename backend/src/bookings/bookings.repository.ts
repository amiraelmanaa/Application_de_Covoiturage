import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsRepository {
  constructor(private readonly dataSource: DataSource) {}

  create(journeyId: string, passengerId: string, manager?: EntityManager): Promise<Booking> {
    const m = manager ?? this.dataSource.manager;
    return m.save(m.create(Booking, { journeyId, passengerId }));
  }
}