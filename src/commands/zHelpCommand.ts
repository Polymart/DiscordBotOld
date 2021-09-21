import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { MessageEmbed } from 'discord.js'
import PolyBaseCommand from '../classes/PolyCommand'
import { HelpTopic, Topics } from '../classes/Topics'

export class HelpCommand extends PolyBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'help',
            description: 'Shows the help menu',
            helpText: 'Shows the help menu',
            options: [
                {
                    name: 'topic',
                    type: CommandOptionType.STRING,
                    description: 'XX',
                    choices: creator.commands.map((v: PolyBaseCommand) => ({
                        name: v.commandName,
                        value: v.commandName,
                    })).concat(Topics.items().map((v: HelpTopic) => ({
                        name: v.topicName,
                        value: v.topicName,
                    }))),
                }
            ]
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        if (typeof ctx.options.topic === 'undefined') {
            return {
                embeds: [
                    new MessageEmbed().addField('Commands:', this.creator.commands.map((v: PolyBaseCommand) => {
                        return `**${v.commandName}** - ${v.description}`
                    })).addField('Topics:', Topics.items().map((v: HelpTopic) => {
                        return `**${v.topicName}** - ${v.description}`
                    })).setAuthor('Polymart Help Commands', this.client.user?.displayAvatarURL()).toJSON(),
                ],
            }
        }

        const search: string = <string>ctx.options.topic
        let topic: PolyBaseCommand | HelpTopic | undefined = Topics.items().find(v => v.topicName === search)
        let isCommand = false
        if (typeof topic === 'undefined') {
            topic = <PolyBaseCommand> this.creator.commands.find(v => v.commandName === search)
            isCommand = true
        }

        const embed = new MessageEmbed().setTitle('Help: ' + search).setDescription(topic.helpText).setAuthor('Polymart Help Commands', this.client.user?.displayAvatarURL())

        if (isCommand && topic instanceof PolyBaseCommand && typeof topic.options !== 'undefined') {
            embed.addField('Usages:', topic.options.map((v) => {
                switch (v.type) {
                    case CommandOptionType.SUB_COMMAND:
                        return `**${search} ${v.name} ` + v.options?.map((v) => {
                            return `<${v.required === true ? '' : '?'}${v.name}>`
                        }) + `** - ${v.description}`
                    case CommandOptionType.STRING:
                        return `**${search} <${v.name}>** - ${v.description}`
                    default:
                        return 'None'
                }
            }))
        }


        return {
            embeds: [embed.toJSON()]
        }

    }
}
