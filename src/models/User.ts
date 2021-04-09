import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
    constructor(userId: string, polymartId: string) {
        super()
        if (userId) this.Id = userId
        if (polymartId) this.polymartUserId = polymartId
    }

    @PrimaryColumn()
    Id: string

    @Column()
    polymartUserId: string

}
