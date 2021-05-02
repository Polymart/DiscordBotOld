import { APIMessageContentResolvable, GuildMember, Message, MessageAdditions, MessageEmbed, MessageOptions, TextChannel } from 'discord.js'
import { client } from '../index'
import { CommandContext } from 'slash-create'
import consola from 'consola'

/*
 * Collection of helper function to get discord methods from slash-create's Command Context
 */

/**
 * Get current channel
 *
 * @param ctx
 * @returns {Promise<TextChannel>}
 */
export async function getChannel(ctx: CommandContext): Promise<TextChannel> {
    return <TextChannel>(await client.guilds.cache.get(ctx.guildID)).channels.cache.get(ctx.channelID)
}

/**
 * Get current member
 *
 * @param {CommandContext} ctx
 * @returns {Promise<GuildMember>}
 */
export async function getMember(ctx: CommandContext): Promise<GuildMember> {
    return <GuildMember>(await client.guilds.cache.get(ctx.guildID)).members.cache.get(ctx.member.id)
}

/**
 * Send message to certain channelID in this server
 *
 * @param {CommandContext} ctx
 * @param content
 * @param channelID
 * @returns {Promise<GuildMember>}
 */
export async function sendMessage(ctx: CommandContext, content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions, channelID = ctx.channelID): Promise<Message> {
    return (<TextChannel>(await client.guilds.cache.get(ctx.guildID)).channels.cache.get(channelID)).send(content)
}


export const logError: (error: Error) => void = async (error: Error) => {
    consola.error(error)

    const channel = client.guilds.cache.get('838506324332380231').channels.cache.find(c => c.name === 'console-log') as TextChannel
    if (!channel) return

    const embed = new MessageEmbed().setColor('RED').setTitle('An error occurred with the bot').setDescription(error.message + '```' + error.stack + '```')
    await channel.send(embed)

}
