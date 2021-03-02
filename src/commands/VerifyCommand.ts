import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import PolymartAPI from '../utils/polymartAPI';
import { getMember } from '../utils/helper';
import DB from '../utils/database';
import { verifyURL } from '../index';
import consola from 'consola';

export class VerifyCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'verify',
            description: 'Verify your discord account using Polymart',
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'token',
                    description: 'Token from Polymart',
                    required: false
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const guildDB = DB.guildDB(ctx.guildID);
        const userDB = DB.userDB(ctx.member.id);
        let userID;

        // Grab our api key
        let apiKey;
        if (!guildDB.has('apiKey')) return { content: 'Bot has not been configured correctly. Missing API KEY', ephemeral: true };
        else apiKey = guildDB.get('apiKey');
        
        // Check user token with verifyUser api route
        if (!userDB.has('userID')) {
            if (typeof ctx.options.token === 'undefined') return { content: `Get your token [here](${verifyURL})`, ephemeral: true };

            userID = await PolymartAPI.verifyUser(<string>ctx.options.token);
            if (userID === false) return { content: 'Verification Failed', ephemeral: true };

            // Check userID hasn't been used before!!

            const verificationDB = new DB('verify');
            if (verificationDB.has(userID)) return { content: 'Verification Failed - Account already linked', ephemeral: true };

            verificationDB.set(userID, ctx.member.id);

            // Successfully found Polymart Account
            userDB.set('userID', userID);

        } else userID = userDB.get('userID');

        // Generic verified role
        const member = await getMember(ctx);

        // Check user against the current guilds resources
                
        let validResources = 0;

        if (guildDB.has('resources') && guildDB.get('resources') !== null) {
            const resources = guildDB.get('resources');


            for (const rID in resources) {
                const resourceUserData = await PolymartAPI.getResourceUserData(rID, userID, apiKey);

                if (resourceUserData === null) return { content: 'An error occured fetching user data!', ephemeral: true };
                if (resourceUserData.purchaseValid) {
                    validResources++;

                    if ('role' in resources[rID]) {
                        try {
                            await member.roles.add(resources[rID]['role']);
                        } catch (e) {
                            consola.error(e);
                            if (e.message === 'Missing Permissions')
                                e.message += ' - The Polymart role needs to be above whatever roles you want the Polymart bot to manage.';

                            return { content: e.message, ephemeral: true };
                        }

                    }
                }
            }

        }

        if (guildDB.has('verifiedRole') && validResources > 0)
            await member.roles.add(guildDB.get('verifiedRole'));

        if (validResources > 0) return { content: 'You have been verified!', ephemeral: true };

        return { content: 'You have not purchased any resources!', ephemeral: true };

    }
}

