import { CapacitorSQLite as SQLite } from '@capacitor-community/sqlite';

class Database {

    private static instance: Database;

    private static connected = false;

    private static connecting = false;

    private static initialized = false;

    private static DATABASE = 'wordpressstack.db';

    public connect() {
        if (!Database.connecting && !Database.connected) {
            Database.connecting = true;
            SQLite.createConnection({
                database: Database.DATABASE,
                version: 1,
                encrypted: false
            }).then(async () => {
                await this.initialize()
                Database.connected = true;
                Database.connecting = false;
            }).catch(() => {
                Database.connecting = false;
            })
        }
    }

    private async initialize() {
        await this.executeWithoutSecurityAsertions(
`CREATE TABLE IF NOT EXISTS templates (
id TEXT PRIMARY KEY,
type TEXT,
template TEXT
);`
        )
        Database.initialized = true
    }

    private async executeWithoutSecurityAsertions(statement: string) {
        return await SQLite.execute({
            database: Database.DATABASE,
            statements: statement
        })
    }

    
    public async execute(statement: string) {
        if (!Database.initialized || !Database.connected || Database.connecting) {
            throw new Error("Not initialized db")
        }
        return this.executeWithoutSecurityAsertions(statement)
    }

    public async query(statement: string) {
        if (!Database.initialized || !Database.connected || Database.connecting) {
            throw new Error("Not initialized db")
        }
        return (await SQLite.query({
            database: Database.DATABASE,
            statement: statement
        })).values
    }


    public static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }        
        return Database.instance
    }

}

export default Database.getInstance()