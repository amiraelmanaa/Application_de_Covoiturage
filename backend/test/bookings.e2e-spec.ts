import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { AppModule } from '../src/app.module';
import { Journey } from '../src/journeys/journey.entity';
import { Booking } from '../src/bookings/booking.entity';

describe('POST /bookings (e2e)', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    ds = app.get(DataSource);
  });

  // Start every test with empty tables
  beforeEach(async () => {
    await ds.query('TRUNCATE TABLE bookings, journeys CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  const createJourney = (availableSeats: number) =>
    ds.getRepository(Journey).save({
      origin: 'Tunis',
      destination: 'Sousse',
      departureTime: new Date(Date.now() + 86_400_000),
      availableSeats,
    });

  const book = (journeyId: string, passengerId: string) =>
    request(app.getHttpServer()).post('/bookings').send({ journeyId, passengerId });

  it('1. succeeds when a seat is available and stores the booking', async () => {
    const journey = await createJourney(2);

    const res = await book(journey.id, 'A');

    expect(res.status).toBe(201);
    expect(await ds.getRepository(Booking).count({ where: { journeyId: journey.id } })).toBe(1);
    const updated = await ds.getRepository(Journey).findOneByOrFail({ id: journey.id });
    expect(updated.availableSeats).toBe(1);
  });

  it('2. fails with 409 when no seats are available', async () => {
    const journey = await createJourney(0);

    const res = await book(journey.id, 'A');

    expect(res.status).toBe(409);
    expect(await ds.getRepository(Booking).count()).toBe(0);
  });

  it('3. returns 404 for an unknown journey', async () => {
    const res = await book(randomUUID(), 'A');
    expect(res.status).toBe(404);
  });

  it('4. never overbooks the LAST seat (2 simultaneous requests)', async () => {
    const journey = await createJourney(1);

    const results = await Promise.all([book(journey.id, 'A'), book(journey.id, 'B')]);
    const statuses = results.map((r) => r.status).sort();

    expect(statuses).toEqual([201, 409]);
    expect(await ds.getRepository(Booking).count({ where: { journeyId: journey.id } })).toBe(1);
    const updated = await ds.getRepository(Journey).findOneByOrFail({ id: journey.id });
    expect(updated.availableSeats).toBe(0);
  });

  it('5. stress test: 20 simultaneous requests for 3 seats', async () => {
    const journey = await createJourney(3);

    const results = await Promise.all(
      Array.from({ length: 20 }, (_, i) => book(journey.id, `user${i}`)),
    );

    expect(results.filter((r) => r.status === 201)).toHaveLength(3);
    expect(results.filter((r) => r.status === 409)).toHaveLength(17);
    expect(await ds.getRepository(Booking).count({ where: { journeyId: journey.id } })).toBe(3);
    const updated = await ds.getRepository(Journey).findOneByOrFail({ id: journey.id });
    expect(updated.availableSeats).toBe(0);
  });
});