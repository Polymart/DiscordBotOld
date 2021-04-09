import { ClientEvents } from 'discord.js'
import consola from 'consola'

module.exports = async (...args: ClientEvents['debug']) => {
    const [message] = args

    consola.debug(message)

}
