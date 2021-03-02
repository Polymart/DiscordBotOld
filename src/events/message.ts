import { ClientEvents } from 'discord.js';
import { client } from '../index';
import DB from '../utils/database';

module.exports = async (...args: ClientEvents['message']) => {
    const [message] = args;

    if (message.author.id === client.user.id) return;

    const guildDB = new DB('guilds', message.guild.id);

    if (guildDB.has('verificationChannel') && guildDB.get('verificationChannel') === message.channel.id) await message.delete();
};
