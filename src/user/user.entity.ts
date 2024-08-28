import { Entity, Column, PrimaryColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  publicAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailAddress: string;

  @Column({ type: 'json', nullable: true })
  blockedAddresses: Record<string, string>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  SeedPhrase: string;  

  @Column({ type: 'varchar', length: 255, nullable: true })
  tfaSecret: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publicKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  privateKey: string;

  @Column({ type: 'boolean', default: true })
  tfaEnabled: boolean; 

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
