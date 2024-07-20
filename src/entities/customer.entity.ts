import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  public customerId?: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  public first_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  public last_name: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  public email: string;

  @Column({ name: 'country_code', type: 'varchar', length: 2 })
  public country_code: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 128 })
  public password_hash: string;

  @Column({ name: 'is_active', type: 'boolean' })
  public is_active: boolean;

  @Column({ name: 'is_email_verified', type: 'boolean' })
  public is_email_verified: boolean;

  @Column({ name: 'provider', type: 'varchar', length: 30 })
  public provider: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  public created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public updated_at: Date;
}
