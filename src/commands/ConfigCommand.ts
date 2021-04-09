import { CommandContext, CommandOptionType, SlashCreator } from 'slash-create'
import { MessageOptions } from 'slash-create/lib/context'
import { sendMessage } from '../utils/helper'
import { MessageEmbed } from 'discord.js'
import PolyBaseCommand from '../classes/PolyCommand'
import Database from '../classes/Database'
import { Config } from '../models/Config'

export class ConfigCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'config',
            description: 'Set Polymart Bot configuration options!',
            requiredPermissions: ['ADMINISTRATOR'],
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'set',
                    description: 'Set an option',
                    options: [
                        {
                            name: 'verification',
                            description: 'Sets the verification channel the Polymart bot will listen to',
                            type: CommandOptionType.SUB_COMMAND,
                            options: [
                                {
                                    name: 'channel',
                                    description: 'Sets the verification channel the Polymart bot will listen to',
                                    type: CommandOptionType.CHANNEL,
                                },
                                {
                                    name: 'role',
                                    description: 'Generic role to apply to users who have at least 1 of the resources in the guild\'s resource list.',
                                    type: CommandOptionType.ROLE,
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'apikey',
                            description: 'Sets the API KEY for the guild',
                            options: [
                                {
                                    name: 'key',
                                    description: 'Sets the API KEY for the guild',
                                    type: CommandOptionType.STRING,
                                    required: true,
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        // What options are there
        const manager = await Database.getInstance().getManager()

        let config = await manager.findOne(Config, ctx.guildID)
        if (!config)
            config = new Config(ctx.guildID)

        const key = Object.keys(ctx.options)[0]
        const subKey = Object.keys(ctx.options[key])[0]
        const options = ctx.options[key][subKey]

        switch (key) {
            case 'set':
                switch (subKey) {
                    case 'verification':
                        if ('channel' in options) {
                            config.verificationChannel = options.channel
                            await sendMessage(ctx, ConfigCommand.verificationInstructions(), options.channel)
                        }

                        if ('role' in options)
                            config.verifiedRole = options.role

                        await config.save()
                        return { content: 'Successfully updated verification config!', ephemeral: true }
                    case 'apikey':
                        config.apiKey = options.key
                        await config.save()
                        return { content: 'Successfully set API KEY!', ephemeral: true }
                    default:
                        return { content: 'Not implemented yet!', ephemeral: true }
                }
            default:
                return { content: 'Not implemented yet!', ephemeral: true }
        }

    }

    private static verificationInstructions(): MessageEmbed {
        return new MessageEmbed().setAuthor('How it works', 'https://polymart.org/style/logo.png', 'https://polymart.org').setDescription(
            `Type \`/verify\` to get a verification link, then log in to your polymart account and you will be given a token
                
                Then do \`/verify [token]\` in this channel`,
        ).setFooter('Polymart Verification System')
    }
}
