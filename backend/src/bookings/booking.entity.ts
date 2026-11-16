import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm'

import { Journey } from '../journeys/journey.entity';


@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    journeyId: string;

    @Column()
    passengerId: string;

    @Column({ default: 'CONFIRMED' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    //each booking belongs to one journey (foreign key on journeyId)
    @ManyToOne(() => Journey, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journeyId' })
    journey: Journey;

}
//understand this more