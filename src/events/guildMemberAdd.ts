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
    if (!guildDB.has('apiKey')) return;
    else apiKey = guildDB.get('apiKey');

    if (!userDB.has('userID')) {
        const userID = userDB.get('userID');
        let validResources = 0;

        if (guildDB.has('resources') && guildDB.get('resources') !== null) {
            const resources = guildDB.get('resources');

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

        if (guildDB.has('verifiedRole') && validResources > 0)
            await member.roles.add(guildDB.get('verifiedRole'));
    }

};
