import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import PolymartAPI from '../classes/PolymartAPI'
import { Util } from 'discord.js'
import PolyBaseCommand from '../classes/PolyCommand'
import Database from '../classes/Database'
import { Config } from '../models/Config'
import { Resource } from '../models/Resource'

export class ResourceCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'resource',
            description: 'Set resource options!',
            requiredPermissions: ['ADMINISTRATOR'],
            options: [
                {
                    name: 'config',
                    description: 'Set the role for the resource',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'resourceid',
                            description: 'Resource ID from Polymart',
                            required: true,
                            type: CommandOptionType.INTEGER,
                        },
                        {
                            name: 'role',
                            description: 'Role to assign user if they have this resource when verifying',
                            required: true,
                            type: CommandOptionType.ROLE,
                        },
                    ]
                },
                {
                    name: 'info',
                    description: 'Fetch information on a resource from Polymart',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'resourceid',
                            description: 'Resource ID from Polymart',
                            type: CommandOptionType.INTEGER,
                            required: true,
                        },
                    ],
                }
            ]
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const manager = await Database.getInstance().getManager()
        const config = await manager.findOne(Config, ctx.guildID)
        if (!config) return { content: 'Bot has not been configured correctly.', ephemeral: true }
        let response: ResourceInfo

        const key = Object.keys(ctx.options)[0]

        if (!config.apiKey) {
            return {
                content: 'Bot has not been configured correctly. Missing API KEY',
                ephemeral: true,
            }
        }

        if (typeof ctx.options[key]['resourceid'] !== 'undefined') {
            response = await PolymartAPI.getResourceInfo(ctx.options[key]['resourceid'], config.apiKey)

            if (response === null) return { content: 'Resource not found!', ephemeral: true }
        }

        const resources = await config.resources
        const resource = resources.find(r => r.Id === response.id)

        switch (key) {
            case 'info':
                return {
                    embeds: [
                        {
                            color: Util.resolveColor(response.themeColorDark),
                            author: {
                                name: response.title,
                                url: `https://polymart.org/resource/${response.id}`,
                                icon_url: `https://polymart.org/image/thumbnail/resource/${response.id}.png`
                            },
                            image: {
                                url: `https://polymart.org/image/header/resource/${response.id}.png`
                            },
                            description: response.subtitle,
                            fields: [
                                {
                                    name: 'Price',
                                    value: `${response.price} ${response.currency}`,
                                }
                            ],
                            footer: {
                                text: response.owner.name,
                                icon_url: `https://s3.amazonaws.com/polymart.${response.owner.type}.profilepictures/large/${response.owner.id}`,
                            },
                        }
                    ]
                }
            case 'config':
                if (resource) resource.discordRole = ctx.options[key]['role']
                else resources.push(new Resource(response, ctx.options[key]['role']))

                config.resources = Promise.resolve(resources)
                await config.save()
                return {
                    content: response.title + ' role updated to <@&' + ctx.options[key]['role'] + '>',
                    ephemeral: true,
                }
            default:
                return { content: 'Not implemented yet!', ephemeral: true }

        }
    }
}
