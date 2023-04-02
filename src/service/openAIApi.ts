import { Http } from '@capacitor-community/http';
import debug from './debug';

class OpenAIApi {

    private static OpenAIBearerToken = "OpenAIBearerToken"
    private static OpenAIOrganization = "OpenAIOrganization"

    private static instance: OpenAIApi;

    private bearerToken: string
    private openAIOrganization: string

    constructor() {
        this.bearerToken = localStorage.getItem(OpenAIApi.OpenAIBearerToken)
        this.openAIOrganization = localStorage.getItem(OpenAIApi.OpenAIOrganization)
    }

    public static getInstance(): OpenAIApi {
        if(!OpenAIApi.instance) {
            OpenAIApi.instance = new OpenAIApi()
        }
        return OpenAIApi.instance
    }

    public hasBearerToken() {
        return !!this.bearerToken
    }

    public setBearerToken(bearerToken) {
        this.bearerToken = bearerToken
        localStorage.setItem(OpenAIApi.OpenAIBearerToken, this.bearerToken)
    }

    public hasOpenAIOrganization() {
        return !!this.openAIOrganization
    }

    public setOpenAIOrganization(openAIOrganization) {
        this.openAIOrganization = openAIOrganization
        localStorage.setItem(OpenAIApi.OpenAIOrganization, this.openAIOrganization)
    }

    public async generateChatResponse(
        messages: any[], 
        temperature: number, 
        maxTokens: number, 
        topP: number, 
        frequencyPenalty: number, 
        presencePenalty: number,
        model: string ) {

        const body = {
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            presence_penalty: presencePenalty,
            model: model
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.bearerToken}`
        }

        if (this.openAIOrganization) {
            headers["openai-organization"] = this.openAIOrganization
        }

        const options = {
            url: `https://api.openai.com/v1/chat/completions`,
            data: body,
            headers: headers
        };
        
        const response = await Http.post(options)

        return response.data.choices[0].message
    }
}

export default OpenAIApi.getInstance()