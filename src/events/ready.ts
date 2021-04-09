import { client } from '../index'
import consola from 'consola'
import Database from '../classes/Database'

module.exports = async () => {

    consola.success(`Logged in as ${client.user.tag}`)
    consola.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)

    if (await Database.getInstance().test())
        consola.success('Connected to database')
    else
        consola.error('Database could not connect!')
}
