import { Command, SlashCommandOptions, SlashCreator } from 'slash-create'
import { client } from '../index'
import { Client } from 'discord.js'
import consola from 'consola'

interface PolySlashCommandOptions extends SlashCommandOptions {
    helpText?: string;
}

export default class PolyBaseCommand extends Command {
    readonly helpText: string

    readonly client: Client
    readonly log: (...args: any[]) => void

    constructor(creator: SlashCreator, opts: PolySlashCommandOptions) {
        super(creator, opts)

        this.helpText = opts.helpText ?? 'No help text available'

        this.client = client
        this.log = consola.log
    }
}
