// Require Packages
import get from 'lodash/get';
import { Connection as PromiseConnection } from 'mysql2/promise';

export default async function (db: PromiseConnection, params, options) {

    // Fetch entry
    const [rows] = await db.execute(`SELECT * FROM ${options.table} WHERE ID = (?)`, [params.id]);
    let fetched = rows[0];

    if (!fetched)
        return null;
    else
        fetched = JSON.parse(fetched.json);

    try {
        fetched = JSON.parse(fetched);
    } catch (e) {
        // Empty
    }

    // Check if target was supplied
    if (params.ops.target) fetched = get(fetched, params.ops.target); // Get prop using dot notation

    // Return data
    return fetched;

}
