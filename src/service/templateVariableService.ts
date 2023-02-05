import typesConstantsConfig from "@/constants/typesConstantsConfig";

class TemplateVariableService {

    private static instance: TemplateVariableService;

    public static getInstance(): TemplateVariableService {
        if (!TemplateVariableService.instance) {
            TemplateVariableService.instance = new TemplateVariableService()
        }
        
        return TemplateVariableService.instance
    }

    public getTemplateVariable(type: string) {
        return typesConstantsConfig.templateMap.get(type).getVariables()
    }

    public setTemplateVariables(type: string, variables) {
        typesConstantsConfig.templateMap.get(type).setVariables(variables)
        localStorage.setItem(type+"TemplateVariables", JSON.stringify(variables));
    }

}

export default TemplateVariableService.getInstance()