import { ClientEvents } from 'discord.js'
import PolymartAPI from '../classes/PolymartAPI'
import consola from 'consola'
import Database from '../classes/Database'
import { Config } from '../models/Config'
import { User } from '../models/User'

module.exports = async (...args: ClientEvents['guildMemberAdd']) => {
    const [member] = args

    // When user joins check if they have already verified with the Polymart bot and auto verify them!
    const manager = await Database.getInstance().getManager()
    const config = await manager.findOne(Config, member.guild.id)
    if (!config) return
    const user = await manager.findOne(User, member.user.id)
    if (!user) return

    const resources = await config.resources
    // Grab our api key
    if (!config.apiKey) return

    let validResources = 0

    const userData = await PolymartAPI.getUserData(user.polymartUserId, config.apiKey)
    if (userData === null) return

    for (const resource of userData.resources) {
        if (resource.purchaseValid) {
            validResources++

            const resourceConfig = resources.find(r => r.Id === resource.id)
            if (resourceConfig) {
                try {
                    await member.roles.add(resourceConfig.discordRole)
                } catch (e) {
                    consola.error(e)
                }
            }
        }
    }

    if (config.verifiedRole && validResources > 0)
        await member.roles.add(config.verifiedRole)

}
