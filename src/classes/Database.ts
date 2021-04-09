import { Connection, createConnection, EntityManager, EntityTarget, Repository } from 'typeorm'

export default class Database {
    private static instance = new Database()
    public static getInstance: () => Database = () => Database.instance

    private conn: Connection

    private constructor() {
        // Empty
    }

    async getRepo(repo: EntityTarget<any>): Promise<Repository<any>> {
        return (await this.getConnection()).manager.getRepository(repo)
    }

    private async getConnection(): Promise<Connection> {
        if (!this.conn)
            this.conn = await createConnection()

        return this.conn
    }

    async test(): Promise<boolean> {
        return (await this.getConnection()).isConnected
    }

    async getManager(): Promise<EntityManager> {
        return (await this.getConnection()).manager
    }
}
