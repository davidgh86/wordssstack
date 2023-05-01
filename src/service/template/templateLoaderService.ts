import elementTemplateParser from "../elementTemplateParser";

class TemplateLoaderService {

    private static instance: TemplateLoaderService;

    public static getInstance() {
        if (!TemplateLoaderService.instance) {
            TemplateLoaderService.instance = new TemplateLoaderService()
        }
        return TemplateLoaderService.instance
    }

    public inferTemplates(html: string) {
        return elementTemplateParser.getTemplates(html)
    }
}

export default TemplateLoaderService.getInstance()