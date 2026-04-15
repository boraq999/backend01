import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ length: 50 })
  role: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
