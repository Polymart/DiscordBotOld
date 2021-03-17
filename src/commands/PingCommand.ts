import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { client } from '../index';
import { MessageOptions } from 'slash-create/lib/context';

export class PingCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Test bot latency!',
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        return { content: `Pong! Latency: \`${client.ws.ping}ms\`!`, ephemeral: true, includeSource: true };
    }
}
