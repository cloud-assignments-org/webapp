import { Entity, Column } from "typeorm"
import { CloudBaseEntity } from "./CloudBaseEntity.js"

@Entity()
export class User extends CloudBaseEntity {

    @Column("varchar")
    email!: string

    @Column("varchar")
    password!: string

    @Column("varchar")
    firstName!: string

    @Column("varchar")
    lastName!: string

}
