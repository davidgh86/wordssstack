import TypesConstantsConfig from "@/constants/typesConstantsConfig2";

class TemplateVariableService {

    private static instance: TemplateVariableService;

    public static getInstance(): TemplateVariableService {
        if (!TemplateVariableService.instance) {
            TemplateVariableService.instance = new TemplateVariableService()
        }
        
        return TemplateVariableService.instance
    }

    public getTemplateVariable(type: string) {
        return TypesConstantsConfig.templateMap.get(type).getVariables()
    }

    public setTemplateVariables(type: string, variables) {
        TypesConstantsConfig.templateMap.get(type).setVariables(variables)
        localStorage.setItem(type+"TemplateVariables", JSON.stringify(variables));
    }

}

export default TemplateVariableService.getInstance()