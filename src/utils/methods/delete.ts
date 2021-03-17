// Require Packages
import unset from 'lodash/unset';
import { Connection as PromiseConnection } from 'mysql2/promise';

export default async function (db: PromiseConnection, params, options) {

    // Fetch entry
    const [rows] = await db.execute(`SELECT * FROM ${options.table} WHERE ID = (?)`, [params.id]);
    let fetched = rows[0];

    if (!fetched) return false; // If empty, return null
    else fetched = JSON.parse(fetched.json);
    try {
        fetched = JSON.parse(fetched);
    } catch (e) {
        // Empty
    }

    // Check if the user wants to delete a prop inside an object
    if (typeof fetched === 'object' && params.ops.target) {
        unset(fetched, params.ops.target);
        fetched = JSON.stringify(fetched);
        await db.execute(`UPDATE ${options.table} SET json = (?) WHERE ID = (?)`, [fetched, params.id]);
        return true;
    } else if (params.ops.target) throw new TypeError('Target is not an object.');
    else await db.execute(`DELETE FROM ${options.table} WHERE ID = (?)`, [params.id]);

    // Resolve
    return true;

}
