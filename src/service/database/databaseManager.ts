class DatabaseManager {

    private db: SQLiteDB;

    private static instance: DatabaseManager;

    public open() {
        this.db = (window as any).sqlitePlugin.openDatabase({
            name: 'wordpressstack.db',
            location: 'default',
            androidDatabaseProvider: 'system'
          });
    }

    public static getInstance(): DatabaseManager {
        if(!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager()
        }
        return DatabaseManager.instance
    }

    public initialize() {
        this.db.transaction(function(tx) {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS templates (
                uuid TEXT PRIMARY KEY,
                type TEXT,
                template TEXT
            );`);
            // tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
            // tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Populated database OK');
          });
    }

    public executeSql(
        statement: string,
        params?: any[]
      ): Promise<SQLiteResultSet> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                function(tx) {
                    tx.executeSql(statement, params, function(tx: SQLiteTransaction, resultSet: SQLiteResultSet) {
                        resolve(resultSet)
                    }, function(error) {
                        reject(error)
                    })
                },
                function(error) {
                    reject(error)
                }
            )
        })    
    }

}

export default DatabaseManager.getInstance()