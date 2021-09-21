import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
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
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'apikey',
                    description: 'Set api key for bot to use',
                    options: [
                        {
                            name: 'value',
                            description: 'Value of API KEY',
                            type: CommandOptionType.STRING
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'role',
                    description: 'Which role should be used as the "generic" verified role',
                    options: [
                        {
                            name: 'value',
                            description: 'Which role should be used as the "generic" verified role',
                            type: CommandOptionType.ROLE
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
        const value = ctx.options[key]['value'] ?? null

        switch (key) {
            case 'role':
                config.verifiedRole = value
                await config.save()
                return { content: `Successfully set verified role to ${value}!`, ephemeral: true }
            case 'apikey':
                config.apiKey = value
                await config.save()
                return { content: `Successfully set API KEY to ${value}!`, ephemeral: true }
            default:
                return { content: 'Not implemented yet!', ephemeral: true }
        }

    }
}
