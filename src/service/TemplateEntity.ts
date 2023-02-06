export default class TemplateEntity {

    private template: string;
    private variables: any;
    private _isUrl: boolean;

    constructor(template, variables, isUrl) {
        this.template = template;
        this.variables = variables;
        this._isUrl = isUrl;
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

    public isUrl() {
        return this._isUrl;
    }
}
