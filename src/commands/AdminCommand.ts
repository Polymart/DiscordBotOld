import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import DB from '../utils/database';
import PolyBaseCommand from '../classes/PolyCommand';

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
                            required: true
                        }
                    ]
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        // What options are there
        // const guildDB = DB.guildDB(ctx.guildID);
        const verificationDB = new DB('verify');

        const key = Object.keys(ctx.options)[0];
        const options = ctx.options[key];

        switch (key) {
            case 'unlink':
                if (!await verificationDB.has(options['userid'])) return { content: 'User not verified!', ephemeral: true };
                // TODO remove verified roles from discord user that was connected to the userid
                await verificationDB.delete(options['userid']);
                return { content: 'Unlinked user!', ephemeral: true };
            default:
                return { content: 'Not implemented yet!', ephemeral: true };
        }

    }
}
