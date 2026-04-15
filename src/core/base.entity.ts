import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { UuidHelper } from '../common/uuid.helper';

export abstract class BaseEntity {
  @PrimaryColumn('binary', { length: 16 })
  id: Buffer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = UuidHelper.toBinary(UuidHelper.generate());
    }
  }

  getIdAsString(): string {
    return UuidHelper.fromBinary(this.id);
  }
}
