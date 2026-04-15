import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@Entity('outbox')
export class Outbox extends BaseEntity {
  @Column({ length: 100, name: 'event_type' })
  eventType: string;

  @Column('json', { name: 'event_data' })
  eventData: any;

  @Column({ type: 'boolean', default: false, name: 'is_processed' })
  isProcessed: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'processed_at' })
  processedAt: Date;

  @Column('text', { nullable: true, name: 'error_message' })
  errorMessage: string;
}
