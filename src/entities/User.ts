import { Entity, Column } from "typeorm"
import { CloudBaseEntity } from "./CloudBaseEntity.js"

@Entity()
export class User extends CloudBaseEntity {

    @Column({type:"string"})
    email!: string

    @Column({type : "varying character"})
    password!: string

    @Column({type:"string"})
    firstName!: string

    @Column({type:"string"})
    lastName!: string

}
