import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { Journey } from './journey.entity';

@Injectable()
export class JourneysRepository {
    constructor(private readonly dataSource: DataSource) {}

    //inside a transaction we must use a transaction manager
    private db(manager?: EntityManager) {
        return manager ?? this.dataSource.manager;
    }

    findById(id: string, manager?: EntityManager) {
        return this.db(manager).findOne(Journey, { where: { id } });
    }

    // THE KEY METHOD: check AND decrement in ONE SQL statement.
    // Returns true if a seat was taken, false if none was left.
    async decrementSeatIfAvailable(id: string, manager?: EntityManager): Promise<boolean> {
        const result = await this.db(manager)
        .createQueryBuilder()
        .update(Journey)
        .set({ availableSeats: () => '"availableSeats" - 1' })
        .where('id = :id AND "availableSeats" > 0', { id })
        .execute();
        return (result.affected ?? 0) > 0;
    }
}