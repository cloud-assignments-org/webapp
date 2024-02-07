import 'reflect-metadata'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CloudBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date",  default: () => "CURRENT_TIMESTAMP" })
  dateCreated!: Date;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  lastModified!: Date;
}
