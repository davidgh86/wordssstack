import database from "./database";

class TemplateDB {

    private static instance: TemplateDB;

    public static getInstance() {
        if (!TemplateDB.instance) {
            TemplateDB.instance = new TemplateDB()
        }
        return TemplateDB.instance
    }

    public async getTemplatesByType(type: string) {
        return await database.query(`SELECT * from templates where type='${type}';`)
    }

}

export default TemplateDB.getInstance()