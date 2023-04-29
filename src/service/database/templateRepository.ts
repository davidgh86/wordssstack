import databaseManager from "./databaseManager";
import { v4 as uuid } from 'uuid'

class TemplateRepository {

    private static instance: TemplateRepository;

    public static getInstance(): TemplateRepository {
        if(!TemplateRepository.instance) {
            TemplateRepository.instance = new TemplateRepository()
        }
        return TemplateRepository.instance
    }

    public async saveTemplate(template: string, type: string): Promise<any> {
      return await databaseManager.executeSql(`INSERT INTO templates VALUES (?1, ?2, ?3)`, [uuid(), type, template]);
    }

    public async getAllTemplates() {
        const allTemplatesRs = await databaseManager.executeSql(`SELECT * from templates`)
        const result = []
        for (let i=0; i<allTemplatesRs.rows.length; i++){
            const tmpl = allTemplatesRs.rows.item(i);
            result.push(tmpl)
        }
        return result;
    }
}

export default TemplateRepository.getInstance()