import { Http } from '@capacitor-community/http';
import debug from './debug';

class OpenAIApi {

    private bearerToken: string
    private openAIOrganization: string

    constructor(bearerToken: string, openAIOrganization: string) {
        this.bearerToken = bearerToken
        this.openAIOrganization = openAIOrganization
    }

    public async generateText(text: string) {

        const body = {
            model: "text-davinci-003",
            prompt: text
        }

        const options = {
            url: `https://api.openai.com/v1/completions`,
            data: body,
            headers: {
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(body).length+"",
                "Authorization": `Bearer ${this.bearerToken}`
            }
        };
        
        const response = await Http.post(options)
        debug.debugAlert(JSON.stringify(response))

        return response.data
    }
}

export default OpenAIApi