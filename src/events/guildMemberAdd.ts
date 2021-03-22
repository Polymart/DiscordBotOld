import { ClientEvents } from 'discord.js';
import DB from '../utils/database';
import PolymartAPI from '../utils/polymartAPI';
import consola from 'consola';
import groupBy from 'lodash/groupBy';

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

        if (await guildDB.has('resources')) {
            const resources = await guildDB.get('resources');

            const userData = await PolymartAPI.getUserData(userID, apiKey);
            if (userData === null) return;

            const userResourceData = groupBy(userData.resources, 'id');

            for (const rID in resources) {
                const resourceInfo = resources[rID];

                if (userResourceData[resourceInfo.id][0]['purchaseValid']) {
                    validResources++;

                    if ('role' in resourceInfo) {
                        try {
                            await member.roles.add(resourceInfo['role']);
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
