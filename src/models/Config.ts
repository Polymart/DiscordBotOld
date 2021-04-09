import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Resource } from './Resource'

@Entity()
export class Config extends BaseEntity {
    constructor(guildId: string) {
        super()
        if (guildId) this.Id = guildId
    }

    @PrimaryColumn()
    Id: string

    @Column({ nullable: true })
    apiKey: string

    @Column({ nullable: true })
    verificationChannel: string

    @Column({ nullable: true })
    verifiedRole: string

    @OneToMany(() => Resource, resource => resource.guild, {
        eager: true,
        cascade: true,
    })
    resources: Promise<Resource[]>

}
