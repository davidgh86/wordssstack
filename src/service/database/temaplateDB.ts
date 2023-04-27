import database from "./database";
import { v4 as uuid } from 'uuid'

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

    public async persistTemplate(template: string, type: string) {
        await database.execute(`INSERT INTO templates (id, type, template) VALUES ('${uuid()}', '${type}', '${template}')`)
    }

}

export default TemplateDB.getInstance()