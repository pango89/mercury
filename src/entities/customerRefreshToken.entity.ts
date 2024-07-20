import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class CustomerRefreshToken {
  @PrimaryColumn({ name: 'customer_id', type: 'integer' })
  public customerId: number;

  @Column({ name: 'token_id', type: 'uuid' })
  public tokenId: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @Column({ name: 'expiry', type: 'timestamp' })
  public expiry: Date;
}
