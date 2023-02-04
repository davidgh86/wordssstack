export default class TemplateEntity {

    private template: string;
    private variables: any;

    constructor(template, variables) {
        this.template = template;
        this.variables = variables
    }

    public setTemplate(template: string) {
        this.template = template
    }

    public setVariables(variables: any) {
        this.variables = variables
    }

    public getTemplate() {
        return this.template;
    }

    public getVariables() {
        return this.variables;
    }
}
