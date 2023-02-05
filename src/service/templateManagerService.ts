import templateVariableService from '../service/templateVariableService'
import templateService from '../service/templateService'

class TemplateManagerService {

    private static instance: TemplateManagerService;
    private static regex = /\{[a-zA-Z-_0-9]+\}/g;

    public static getInstance(): TemplateManagerService {
        if (!TemplateManagerService.instance) {
            TemplateManagerService.instance = new TemplateManagerService()
        }
        
        return TemplateManagerService.instance
    }

    getTemplate(type: string) {
        return templateService.getTemplate(type)
    }    

    setTemplate(type: string, template) {
        const variables = templateVariableService.getTemplateVariable(type)
        this.assertVariablesConformTemplate(variables, template)
        templateService.setTemplate(type, template)
    }

    getTemplateVariables(type: string) {
        return templateVariableService.getTemplateVariable(type)
    }

    setTemplateVariables(type: string, variables) {
        const template = templateService.getTemplate(type)
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setTemplateVariables(type, variables)
    }

    setTemplateAndVariables(type: string, template, variables) {
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setTemplateVariables(type, variables)
        templateService.setTemplate(type, template)
    }

    updateTemplateVariables(oldVarName, newVarName, template) {
        return template.replaceAll("{"+oldVarName+"}", "{"+newVarName+"}")
    }

    renderTemplate(variables, template) {
        let result = template;
        for (const variable of variables) {
            result = result.replaceAll("{"+variable.variableName+"}", variable.variableValue)
        }
        return result
    }

    private static getVarNamesFromTemplate(template: string) {
        const results = template.matchAll(this.regex)
        const arrayResult = []
        for (const match of results) {
            arrayResult.push(match[0])
        }
        return arrayResult
    }

    private assertVariablesConformTemplate(variables: Array<any>, template) {
        const variablesInTemplate = TemplateManagerService.getVarNamesFromTemplate(template)
        const notInAllVariables = []
        const notInTemplateVariables = []
        const allVariables = variables.map(variable => "{"+variable.variableName+"}");
        for (const variableInTemplate of variablesInTemplate) {
            if (!allVariables.some(el => variableInTemplate === el)){
                notInAllVariables.push(variableInTemplate)
            }
        }

        for (const variable of allVariables) {
            if (!variablesInTemplate.some(el => variable === el)){
                notInTemplateVariables.push(variable)
            }
        }

        if (notInAllVariables.length == 0 && notInTemplateVariables.length==0){
            return
        }

        const messages = []

        if (notInAllVariables.length > 0) {
            messages.push("This variables are in templates but not defined: " + notInAllVariables.join(", "))
        }

        if (notInTemplateVariables.length > 0) {
            messages.push("Those template variables are defined but not in template: " + notInTemplateVariables.join(", "))
        }

        throw new Error(messages.join(", "))
    }

}

export default TemplateManagerService.getInstance()



