import { ClientEvents } from 'discord.js'
import { client } from '../index'
import Database from '../classes/Database'
import { Config } from '../models/Config'

module.exports = async (...args: ClientEvents['message']) => {
    const [message] = args

    if (message.author.id === client.user.id) return

    const manager = await Database.getInstance().getManager()
    const config = await manager.findOne(Config, message.guild.id)

    if (config && config.verificationChannel === message.channel.id) await message.delete()
}
