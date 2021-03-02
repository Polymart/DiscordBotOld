import { APIMessageContentResolvable, GuildMember, Message, MessageAdditions, MessageOptions, TextChannel } from 'discord.js';
import { client } from '../index';
import { CommandContext } from 'slash-create';

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
    return <TextChannel>(await client.guilds.fetch(ctx.guildID)).channels.cache.get(ctx.channelID);
}

/**
 * Get current member
 *
 * @param {CommandContext} ctx
 * @returns {Promise<GuildMember>}
 */
export async function getMember(ctx: CommandContext): Promise<GuildMember> {
    return <GuildMember>(await client.guilds.fetch(ctx.guildID)).members.cache.get(ctx.member.id);
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
    return (<TextChannel>(await client.guilds.fetch(ctx.guildID)).channels.cache.get(channelID)).send(content);
}
