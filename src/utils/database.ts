import db, { Options, ValueData } from 'quick.db';

class DB {

    keyPrefix = '';

    super: db.table;

    constructor(tableName: string, keyPrefix?: string) {
        this.super = new db.table(tableName);

        if (typeof keyPrefix !== 'undefined')
            this.keyPrefix = keyPrefix + '.';

    }

    set(key: string, value: ValueData, ops?: Options): any {
        key = this.keyPrefix + key;
        return this.super.set(key, value, ops);
    }

    get(key: string, ops?: Options): any {
        key = this.keyPrefix + key;
        return this.super.get(key, ops);
    }

    fetch(key: string, ops?: Options): any {
        key = this.keyPrefix + key;
        return this.super.fetch(key, ops);
    }

    add(key: string, value: number, ops?: Options): any {
        key = this.keyPrefix + key;
        return this.super.add(key, value, ops);
    }

    subtract(key: string, value: number, ops?: Options): any {
        key = this.keyPrefix + key;
        return this.super.subtract(key, value, ops);
    }

    push(key: string, value: ValueData, ops?: Options): any[] {
        key = this.keyPrefix + key;
        return this.super.push(key, value, ops);
    }

    has(key: string, ops?: Options): boolean {
        key = this.keyPrefix + key;
        return this.super.has(key, ops);
    }

    includes(key: string, ops?: Options): boolean {
        key = this.keyPrefix + key;
        return this.super.includes(key, ops);
    }

    delete(key: string, ops?: Options): boolean {
        key = this.keyPrefix + key;
        return this.super.delete(key, ops);
    }

    static guildDB(guildID: string): DB {
        return new DB('guilds', guildID);
    }

    static userDB(userID: string): DB {
        return new DB('users', userID);
    }
}

export default DB;
