import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import PolymartAPI from '../classes/PolymartAPI'
import { getMember } from '../utils/helper'
import { verifyURL } from '../index'
import consola from 'consola'
import PolyBaseCommand from '../classes/PolyCommand'
import Database from '../classes/Database'
import { Config } from '../models/Config'
import { User } from '../models/User'

export class VerifyCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'verify',
            description: 'Verify your discord account using Polymart',
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'token',
                    description: 'Token from Polymart',
                    required: false,
                },
            ],
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const manager = await Database.getInstance().getManager()
        const config = await manager.findOne(Config, ctx.guildID)
        if (!config) {
            return {
                content: 'Bot has not been configured correctly.',
                ephemeral: true,
            }
        }
        let user = await manager.findOne(User, ctx.member.id)

        const resources = await config.resources

        // Grab our api key
        if (!config.apiKey) {
            return {
                content: 'Bot has not been configured correctly. Missing API KEY',
                ephemeral: true,
            }
        }

        // Check user token with verifyUser api route
        if (!user) {
            if (!ctx.options.token) return { content: `Get your token [here](${verifyURL})`, ephemeral: true }

            const userID = await PolymartAPI.verifyUser(<string>ctx.options.token)
            if (!userID) return { content: 'Verification Failed', ephemeral: true }

            // Check userID hasn't been used before!!
            // TODO: remove old verification and roles from discord user and assign this user as the new user
            if (await manager.findOne(User, { polymartUserId: userID })) {
                return {
                    content: 'Verification Failed - Account already linked',
                    ephemeral: true,
                }
            }

            // Successfully found Polymart Account
            user = new User(ctx.member.id, userID)
            await user.save()
        }

        const member = await getMember(ctx)
        let validResources = 0

        const userData = await PolymartAPI.getUserData(user.polymartUserId, config.apiKey)
        if (!userData) return { content: 'An error occured fetching user data!', ephemeral: true }

        for (const resource of userData.resources) {
            if (resource.purchaseValid && resource.purchaseStatus !== 'Free') {
                validResources++

                const resourceConfig = resources.find(r => r.Id === resource.id)
                if (resourceConfig) {
                    try {
                        await member.roles.add(resourceConfig.discordRole)
                    } catch (e) {
                        consola.error(e)
                        if (e.message === 'Missing Permissions')
                            e.message += ' - The Polymart role needs to be above whatever roles you want the Polymart bot to manage.'

                        return { content: e.message, ephemeral: true }
                    }
                }
            }
        }

        if (config.verifiedRole && validResources > 0)
            await member.roles.add(config.verifiedRole)

        if (validResources > 0) return { content: 'You have been verified!', ephemeral: true }

        return { content: 'You have not purchased any resources!', ephemeral: true }

    }
}

