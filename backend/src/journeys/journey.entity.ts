import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('journeys')
@Check('"availableSeats" >= 0')

export class Journey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column({ type: 'timestamp' })
    departureTime: Date;

    @Column({ type: 'int' })
    availableSeats: number;
}