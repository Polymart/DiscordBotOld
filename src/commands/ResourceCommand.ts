import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import PolymartAPI from '../utils/polymartAPI';
import DB from '../utils/database';
import { hexToDec } from 'hex2dec';

export class ResourceCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'resource',
            description: 'Set resource options!',
            requiredPermissions: ['ADMINISTRATOR'],
            options: [
                {
                    name: 'add',
                    description: 'Add a resource to be checked when a user verifies with Polymart',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'resourceid',
                            description: 'Resource ID from Polymart',
                            required: true,
                            type: CommandOptionType.INTEGER
                        },
                        {
                            name: 'role',
                            description: 'Role to assign user if they have this resource when verifying',
                            type: CommandOptionType.ROLE
                        }
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
                            required: true
                        }
                    ]
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const guildDB = DB.guildDB(ctx.guildID);
        let response: ResourceInfo;

        const key = Object.keys(ctx.options)[0];

        // Grab our api key
        let apiKey;
        if (!guildDB.has('apiKey')) return { content: 'Bot has not been configured correctly. Missing API KEY', ephemeral: true };
        else apiKey = guildDB.get('apiKey');

        if (typeof ctx.options[key]['resourceid'] !== 'undefined') {
            response = await PolymartAPI.getResourceInfo(ctx.options[key]['resourceid'], apiKey);

            if (response === null) return { content: 'Resource not found!', ephemeral: true };
        }

        switch (key) {
            case 'info':
                return {
                    embeds: [
                        {
                            color: hexToDec(response.themeColorDark),
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
                                    value: `${response.price} ${response.currency}`
                                }
                            ],
                            footer: {
                                text: response.owner.name,
                                icon_url: `https://s3.amazonaws.com/polymart.${response.owner.type}.profilepictures/large/${response.owner.id}`,
                                iconURL: `https://s3.amazonaws.com/polymart.${response.owner.type}.profilepictures/large/${response.owner.id}`
                            }
                        }
                    ]
                };
            case 'add':
                if ('role' in <any>ctx.options[key]) response['role'] = ctx.options[key]['role'];
                guildDB.set(`resources.r_${response.id}`, response);

                return { content: response.title + ' added to the guild\'s resource list!', ephemeral: true };
            default:
                return { content: 'Not implemented yet!', ephemeral: true };

        }
    }
}
