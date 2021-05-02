import consola from 'consola'
import { Client } from 'discord.js'
import * as dotenv from 'dotenv'
import fs from 'fs'
import * as path from 'path'
import { GatewayServer, SlashCreator } from 'slash-create'
import PolymartAPI from './classes/PolymartAPI'
import { logError } from './utils/helper'

dotenv.config({
    path: '../.env',
})

const client: Client = new Client({
    presence: { activity: { name: '/verify with Polymart' }, status: 'online' },
    partials: ['MESSAGE', 'REACTION'],
})

const creator = new SlashCreator({
    applicationID: process.env.APPLICATION_ID,
    token: process.env.BOT_TOKEN,
})

// @ts-expect-error INTERACTION_CREATE is not yet an event for this version of discord.js
creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler))).registerCommandsIn(path.join(__dirname, 'commands')).syncGlobalCommands()

creator.on('synced', () => {
    consola.success('Finished syncing commands!')
})
creator.on('debug', (message) => consola.debug(message))
creator.on('warn', (message) => consola.warn(message))
creator.on('error', (error) => consola.error(error))
creator.on('commandRun', (command, _, ctx) => consola.info(`${ctx.member.user.username}#${ctx.member.user.discriminator} (${ctx.member.id}) ran command ${command.commandName}`))
creator.on('commandRegister', (command) => consola.info(`Registered command ${command.commandName}`))
creator.on('commandError', (command, error) => consola.error(`Command ${command.commandName}:`, error))
creator.on('commandBlock', (command, ctx, reason) => consola.info(`Command ${command.commandName} was blocked for ${ctx.member.user.username}#${ctx.member.user.discriminator}. Reason: ${reason}`))

fs.readdir(path.join(__dirname, 'events'), (err, files) => {
    if (err)
        return consola.error(err)

    files.forEach(file => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const event = require(`./events/${file}`)
        const eventName = file.split('.')[0]
        client.on(eventName, event)
    })
})

let verifyURL
client.login(process.env.BOT_TOKEN).then(async () => {
    verifyURL = await PolymartAPI.generateUserVerifyURL()

    // If the bot is in the polymart server, sync the polymart server commands
    if (client.guilds.cache.get('708395251823542312'))
        creator.syncCommandsIn('708395251823542312')

    // If the bot is in the test server, sync the test server commands
    if (client.guilds.cache.get('838506324332380231'))
        creator.syncCommandsIn('838506324332380231')
})

process.on('unhandledRejection', (error: Error, promise: Promise<any>) => logError(error))
process.on('uncaughtException', (error: Error, origin: string) => logError(error))

export { client, verifyURL }
