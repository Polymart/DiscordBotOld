import mysql from 'mysql2';

import set from './methods/set';
import has from './methods/has';
import get from './methods/get';
import del from './methods/delete';
import consola from 'consola';

export interface Options {
    target?: string | null;
    table?: string;
}

export type ValueData = string | number | object | null | boolean | bigint | symbol | any[];

class DB {

    // Declare Methods
    methods = {
        get,
        set,
        del,
        has
    };

    keyPrefix = '';

    private static conn: mysql.Connection;
    private tableName: string;

    constructor(tableName: string, keyPrefix?: string) {
        this.tableName = tableName;

        if (typeof keyPrefix !== 'undefined')
            this.keyPrefix = keyPrefix + '.';

    }

    async set(key: string, value: ValueData, ops?: Options): Promise<unknown> {
        if (!key)
            throw new TypeError('No key specified.');

        if (value === undefined)
            throw new TypeError('No value specified.');

        key = this.keyPrefix + key;

        return await this.arbitrate('set', {
            stringify: true,
            id: key,
            data: value,
            ops: ops || {},
        });
    }

    async get(key: string, ops?: Options): Promise<any> {
        if (!key)
            throw new TypeError('No key specified.');

        key = this.keyPrefix + key;

        return await this.arbitrate('get', { id: key, ops: ops || {} });
    }

    async has(key: string, ops?: Options): Promise<boolean> {
        if (!key)
            throw new TypeError('No key specified.');

        key = this.keyPrefix + key;

        return await this.arbitrate('has', { id: key, ops: ops || {} });
    }

    async delete(key: string, ops?: Options): Promise<boolean> {
        if (!key)
            throw new TypeError('No key specified.');

        key = this.keyPrefix + key;

        return await this.arbitrate('del', { id: key, ops: ops || {} });
    }


    async arbitrate(method: string, params: { stringify?: any; id: any; data?: any; ops: any; }) {
        // Configure Options
        const options = {
            table: this.tableName || params.ops.table || 'json',
        };

        // Access Database
        await DB.getConnection().execute(`CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`);

        // Verify Options
        if (params.ops.target && params.ops.target[0] === '.')
            params.ops.target = params.ops.target.slice(1); // Remove prefix if necessary
        if (params.data && params.data === Infinity) 
            throw new TypeError(`You cannot set Infinity into the database @ ID: ${params.id}`);
        

        // Stringify
        if (params.stringify) {
            try {
                params.data = JSON.stringify(params.data);
            } catch (e) {
                throw new TypeError(`Please supply a valid input @ ID: ${params.id}\nError: ${e.message}`);
            }
        }

        // Translate dot notation from keys
        if (params.id && params.id.includes('.')) {
            const unparsed = params.id.split('.');
            params.id = unparsed.shift();
            params.ops.target = unparsed.join('.');
        }

        // Run & Return Method
        return (this.methods)[method](DB.getConnection().promise(), params, options);

    }

    static guildDB(guildID: string): DB {
        return new DB('guilds', guildID);
    }

    static userDB(userID: string): DB {
        return new DB('users', userID);
    }

    public static getConnection(): mysql.Connection {
        if (!DB.conn) {
            DB.conn = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });
        }

        return DB.conn;
    }

    static connect(): void {
        DB.getConnection().connect(err => {
            if (err) consola.error(err);
        });
    }
}

export default DB;
