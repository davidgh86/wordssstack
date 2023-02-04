import { TypesConstantsConfig } from './TypesConstantsConfig'

class TemplateService {

    private static instance: TemplateService;

    public static getInstance(): TemplateService {
        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService()
        }
        
        return TemplateService.instance
    }

    getTemplate(type: string) {
        TypesConstantsConfig.templateMap.get(type).getTemplate()
    }

    setTemplate(type: string, template) {
        TypesConstantsConfig.templateMap.get(type).setTemplate(template)
        localStorage.setItem(type+"Template", JSON.stringify(template));
    }

}

export default TemplateService.getInstance()