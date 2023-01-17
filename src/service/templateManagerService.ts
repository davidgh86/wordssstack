import templateVariableService from '../service/templateVariableService'
import templateService from '../service/templateService'

class TemplateManagerService {

    private static instance: TemplateManagerService;
    private static regex = /\{[a-zA-Z-_0-9]+\}/g

    constructor() {  // Constructor    
    }

    public static getInstance(): TemplateManagerService {
        if (!TemplateManagerService.instance) {
            TemplateManagerService.instance = new TemplateManagerService()
        }
        
        return TemplateManagerService.instance
    }

    getImageTemplate() {
        return templateService.getImageTemplate()
    }

    getVideoTemplate() {
        return templateService.getVideoTemplate()
    }

    getYoutubeTemplate() {
        return templateService.getYoutubeTemplate()
    }

    getHtmlTemplate() {
        return templateService.getHtmlTemplate()
    }

    setImageTemplate(template) {
        const variables = templateVariableService.getImageTemplateVariables()
        this.assertVariablesConformTemplate(variables, template)
        templateService.setImageTemplate(template)
    }

    setVideoTemplate(template) {
        const variables = templateVariableService.getVideoTemplateVariables()
        this.assertVariablesConformTemplate(variables, template)
        templateService.setVideoTemplate(template)
    }

    setYoutubeTemplate(template) {
        const variables = templateVariableService.getYoutubeTemplateVariables()
        this.assertVariablesConformTemplate(variables, template)
        templateService.setYoutubeTemplate(template)
    }

    setHtmlTemplate(template) {
        const variables = templateVariableService.getHtmlTemplateVariables()
        this.assertVariablesConformTemplate(variables, template)
        templateService.setHtmlTemplate(template)
    }

    setImageTemplateAndVariables(template, variables) {
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setImageTemplateVariables(variables)
        templateService.setImageTemplate(template)
    }

    setVideoTemplateAndVariables(template, variables) {
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setVideoTemplateVariables(variables)
        templateService.setVideoTemplate(template)
    }

    setYoutubeTemplateAndVariables(template, variables) {
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setYoutubeTemplateVariables(variables)
        templateService.setYoutubeTemplate(template)
    }

    setHtmlTemplateAndVariables(template, variables) {
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setHtmlTemplateVariables(variables)
        templateService.setHtmlTemplate(template)
    }

    setImageTemplateDefault() {
        templateVariableService.setImageTemplateDefaultVariables()
        templateService.setImageTemplateDefault()
    }

    setVideoTemplateDefault() {
        templateVariableService.setVideoTemplateDefaultVariables()
        templateService.setVideoTemplateDefault()
    }

    setYoutubeTemplateDefault() {
        templateVariableService.setYoutubeTemplateDefaultVariables()
        templateService.setYoutubeTemplateDefault()
    }

    setHtmlTemplateDefault() {
        templateVariableService.setHtmlTemplateDefaultVariables()
        templateService.setHtmlTemplateDefault()
    }

    getImageTemplateVariables() {
        return templateVariableService.getImageTemplateVariables()
    }

    getVideoTemplateVariables() {
        return templateVariableService.getVideoTemplateVariables()
    }

    getYoutubeTemplateVariables() {
        return templateVariableService.getYoutubeTemplateVariables()
    }

    getHtmlTemplateVariables() {
        return templateVariableService.getHtmlTemplateVariables()
    }

    setImageTemplateVariables(variables) {
        const template = templateService.getImageTemplate()
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setImageTemplateVariables(variables)
    }

    setVideoTemplateVariables(variables) {
        const template = templateService.getImageTemplate()
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setImageTemplateVariables(variables)
    }

    setYoutubeTemplateVariables(variables) {
        const template = templateService.getImageTemplate()
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setImageTemplateVariables(variables)
    }

    setHtmlTemplateVariables(variables) {
        const template = templateService.getImageTemplate()
        this.assertVariablesConformTemplate(variables, template)
        templateVariableService.setImageTemplateVariables(variables)
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



