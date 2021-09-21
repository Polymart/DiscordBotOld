import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import PolyBaseCommand from '../classes/PolyCommand'

export class AdminCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'admin',
            guildIDs: '708395251823542312', // polymart server
            description: 'Polymart Bot admin commands!',
            requiredPermissions: ['ADMINISTRATOR'],
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'unlink',
                    description: 'Unlink discord user',
                    options: [
                        {
                            name: 'userid',
                            description: 'Userid to unlink',
                            type: CommandOptionType.STRING,
                            required: true,
                        },
                    ],
                }
            ]
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        // What options are there
        const key = Object.keys(ctx.options)[0]
        const options = ctx.options[key]

        switch (key) {
            // case 'unlink':
            //     // TODO remove verified roles from discord user that was connected to the userid
            //     return { content: 'Unlinked user!', ephemeral: true }
            default:
                return { content: 'Not implemented yet!', ephemeral: true }
        }

    }
}
