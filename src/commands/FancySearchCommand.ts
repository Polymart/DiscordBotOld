import { CommandContext, CommandOptionType, SlashCreator } from 'slash-create'
import { MessageEmbed, Util } from 'discord.js'
import { getChannel } from '../utils/helper'
import PolymartAPI from '../classes/PolymartAPI'
import { MessageOptions } from 'slash-create/lib/context'
import PolyBaseCommand from '../classes/PolyCommand'
import { User } from '../models/User'
import Database from '../classes/Database'

export class FancySearchCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'search',
            description: 'Search for a resource on Polymart!',
            options: [
                {
                    name: 'query',
                    description: 'Search query',
                    type: CommandOptionType.STRING,
                    required: true,
                },
            ],
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const manager = await Database.getInstance().getManager()
        const user = await manager.findOne(User, ctx.member.id)
        let userId
        if (user) userId = user.polymartUserId

        const channel = await getChannel(ctx)

        const search = <string>ctx.options.query

        let data = (await this.fetchData(search, 0, userId))

        channel.send(this.generateEmbed(data.result[0])).then((message) => {
            message.react('➡️')
            const collector = message.createReactionCollector(
                // only collect left and right arrow reactions from the message author
                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === ctx.member.id,
                // time out after a minute
                { time: 60000 }
            )

            let currentIndex = 0
            collector.on('collect', reaction => {
                // remove the existing reactions
                message.reactions.removeAll().then(async () => {
                    // reset minute timer when we interact with it
                    collector.resetTimer({ time: 60000 })
                    // increase/decrease index
                    reaction.emoji.name === '⬅️' ? currentIndex -= 1 : currentIndex += 1
                    // edit message with new embed
                    data = await this.fetchData(search, currentIndex, userId)
                    await message.edit(this.generateEmbed(data.result[0]))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                    if (currentIndex !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                    if (data.result_count !== 1 || data.more) await message.react('➡️')
                })
            })

            collector.on('end', (e) => {
                message.edit('Search has timed out').then(m => m.delete({ timeout: 5000 }))
            })

        })

        return { content: `Search results for: ${search}`, ephemeral: true }

    }

    async fetchData(query: string, start: number, referrer?: string): Promise<SearchResponse> {
        return await PolymartAPI.search({
            limit: 1,
            query,
            start,
            referrer
        })
    }

    generateEmbed(resource: ResultElement): MessageEmbed {
        return new MessageEmbed({
            color: Util.resolveColor(resource.themeColorDark),
            author: {
                name: resource.title,
                url: resource.url,
                icon_url: `https://polymart.org/image/thumbnail/resource/${resource.id}.png`
            },
            image: {
                url: `https://polymart.org/image/header/resource/${resource.id}.png`
            },
            description: resource.subtitle,
            fields: [
                {
                    name: 'Supported Versions:',
                    value: resource.supportedMinecraftVersions
                },
                {
                    name: 'Price:',
                    value: `${resource.price} ${resource.currency}`,
                },
            ],
            footer: {
                text: resource.owner.name,
                icon_url: `https://s3.amazonaws.com/polymart.${resource.owner.type}.profilepictures/large/${resource.owner.id}`,
                iconURL: `https://s3.amazonaws.com/polymart.${resource.owner.type}.profilepictures/large/${resource.owner.id}`,
            },
        })
    }
}
