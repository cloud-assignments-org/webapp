import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CloudBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  dateCreated!: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  lastModified!: Date;
}
