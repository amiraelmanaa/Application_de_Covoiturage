import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { JourneysRepository } from './journeys.repository';

@Injectable()
export class JourneysService {
  constructor(private readonly journeysRepo: JourneysRepository) {}

  // Takes one seat, or throws an error (404 if no journey, 409 if full).
  async reserveSeat(journeyId: string, manager: EntityManager): Promise<void> {
    const seatTaken = await this.journeysRepo.decrementSeatIfAvailable(journeyId, manager);
    if (seatTaken) return;

    // No row modified: either the journey doesn't exist, or it's full.
    const journey = await this.journeysRepo.findById(journeyId, manager);
    if (!journey) throw new NotFoundException('Journey not found');
    throw new ConflictException('No seats available');
  }
}