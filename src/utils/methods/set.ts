// Require Packages
import set from 'lodash/set';
import { Connection as PromiseConnection } from 'mysql2/promise';

export default async function (db: PromiseConnection, params, options) {

    // Fetch entry
    let [rows] = await db.execute(`SELECT * FROM ${options.table} WHERE ID = (?)`, [params.id]);

    let fetched = rows[0];

    // If not found, create empty row
    if (!fetched) {
        await db.execute(`INSERT INTO ${options.table} (ID,json) VALUES (?,?)`, [params.id, '{}']);
        [rows] = await db.execute(`SELECT * FROM ${options.table} WHERE ID = (?)`, [params.id]);
        fetched = rows[0];
    }

    // Parse fetched
    fetched = JSON.parse(fetched.json);
    try {
        fetched = JSON.parse(fetched);
    } catch (e) {
        // Empty
    }

    // Check if a target was supplied
    if (typeof fetched === 'object' && params.ops.target) {
        params.data = JSON.parse(params.data);
        params.data = set(fetched, params.ops.target, params.data);
    } else if (params.ops.target) throw new TypeError('Cannot target a non-object.');

    // Stringify data
    params.data = JSON.stringify(params.data);

    // Update entry with new data
    await db.execute(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`, [params.data, params.id]);

    // Fetch & return new data
    [rows] = await db.execute(`SELECT * FROM ${options.table} WHERE ID = (?)`, [params.id]);
    let newData = rows[0].json;
    if (newData === '{}') return null;
    else {
        newData = JSON.parse(newData);
        try {
            newData = JSON.parse(newData);
        } catch (e) {
            // Empty
        }
        return newData;
    }

}
