import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AvailabilityProvenance {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum IntervalRecurrenceType {
  NONE = 'none',
  WEEKLY = 'weekly',
}

@Entity('availability_intervals')
@Index(['userId', 'start'])
@Index(['userId', 'recurrence'])
export class AvailabilityInterval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.availabilityIntervals, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;

  @Column({ type: 'int', default: 0 })
  precedence: number;

  @Column({
    type: 'enum',
    enum: AvailabilityProvenance,
    default: AvailabilityProvenance.INTERNAL,
  })
  provenance: AvailabilityProvenance;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({
    type: 'enum',
    enum: IntervalRecurrenceType,
    default: IntervalRecurrenceType.NONE,
  })
  recurrence: IntervalRecurrenceType;

  @Column({ type: 'int', array: true, nullable: true })
  recurrenceDays: number[];

  @Column({ nullable: true })
  externalSourceId: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
