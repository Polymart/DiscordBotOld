import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { MessageEmbed } from 'discord.js';
import { client } from '../index';
import PolyBaseCommand from '../classes/PolyCommand';

export class InviteCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'invite',
            description: 'Get an invite link to add the Polymart bot to your server'
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=268527680&scope=bot%20applications.commands`;
        return { embeds: [new MessageEmbed().setDescription(`Click [here](${link}) to invite me to your server!`).toJSON()] };
    }
}

