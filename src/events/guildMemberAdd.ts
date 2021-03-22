import { ClientEvents } from 'discord.js';
import DB from '../utils/database';
import PolymartAPI from '../utils/polymartAPI';
import consola from 'consola';

module.exports = async (...args: ClientEvents['guildMemberAdd']) => {
    const [member] = args;

    // When user joins check if they have already verified with the Polymart bot and auto verify them!

    const userDB = DB.userDB(member.user.id);
    const guildDB = DB.userDB(member.guild.id);

    // Grab our api key
    let apiKey;
    if (!await guildDB.has('apiKey')) return;
    else apiKey = await guildDB.get('apiKey');

    if (!await userDB.has('userID')) {
        const userID = await userDB.get('userID');
        let validResources = 0;

        if (await guildDB.has('resources') && await guildDB.get('resources') !== null) {
            const resources = await guildDB.get('resources');

            for (const rID in resources) {
                const resourceUserData = await PolymartAPI.getResourceUserData(rID, userID, apiKey);
                const userData = await PolymartAPI.getUserData(userID, apiKey);
                consola.debug(userData);
                if (resourceUserData === null) return;
                if (resourceUserData.purchaseValid) {
                    validResources++;

                    if ('role' in resources[rID]) {
                        try {
                            await member.roles.add(resources[rID]['role']);
                        } catch (e) {
                            consola.error(e);
                        }
                    }
                }
            }

        }

        if (await guildDB.has('verifiedRole') && validResources > 0)
            await member.roles.add(await guildDB.get('verifiedRole'));
    }

};
