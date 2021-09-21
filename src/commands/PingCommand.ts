import { CommandContext, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '../index'
import PolyBaseCommand from '../classes/PolyCommand'

export class PingCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Test bot latency!',
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        return { content: `Pong! Latency: \`${client.ws.ping}ms\`!`, ephemeral: true }
    }
}
