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

    public async generateCompletionResponse(
        model: string,
        prompt?: string,
        max_tokens?: number,
        temperature?: number,
        top_p?: number,
        stop?: string|string[],
        presence_penalty?: number,
        frequency_penalty?: number,
        best_of?: number
    ) {

        const body = {
            prompt: prompt,
            echo:true,
            logprobs:20,
            stream: false,
        }

        if (stop) {
            if (stop.length > 0) {
                body["stop"] = stop
            }
        }

        if (max_tokens){
            body["max_tokens"] = max_tokens
        }
       
        if (temperature){
            body["temperature"] = temperature
        }
        
        if (top_p){
            body["top_p"] = top_p
        }
        
        if (frequency_penalty){
            body["frequency_penalty"] = frequency_penalty
        }
        if (presence_penalty){
            body["presence_penalty"] = presence_penalty
        }
        if (best_of){
            body["best_of"] = best_of
        }
        

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.bearerToken}`
        }

        if (this.openAIOrganization) {
            headers["openai-organization"] = this.openAIOrganization
        }

        const options = {
            url: `https://api.openai.com/v1/engines/${model}/completions`,
            data: body,
            headers: headers
        };
        
        const response = await Http.post(options)
        return response.data.choices[0].text;
    }

    public async generateImage(
        prompt: string,
        n: number,
        size: string,
    ) {

        const body = {
            prompt,
            n,
            size,
            response_format: "b64_json"
        }        

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.bearerToken}`
        }

        if (this.openAIOrganization) {
            headers["openai-organization"] = this.openAIOrganization
        }

        const options = {
            url: `https://api.openai.com/v1/images/generations`,
            data: body,
            headers: headers
        };
        
        const response = await Http.post(options)
        return response.data.data.map(item => {
            return {url: `data:image/png;base64,${item.b64_json}`}
        })
    }

    public async createImageVariation(
        file: File,
        fileName: string,
        n: number,
        size: string,
    ) {

        const formData = new FormData();
        formData.append('image', file, fileName);
        formData.append('n', n+"");
        formData.append('size', size);
        formData.append('response_format', "b64_json");     

        const headers = {
            "Content-Type": 'multipart/form-data',
            "Authorization": `Bearer ${this.bearerToken}`
        }

        if (this.openAIOrganization) {
            headers["openai-organization"] = this.openAIOrganization
        }

        const options = {
            url: 'https://api.openai.com/v1/images/variations',
            data: formData,
            headers: headers
        };
        
        const response = await Http.post(options)
        return response.data.data.map(item => {
            return {url: `data:image/png;base64,${item.b64_json}`}
        })
    }
}

export default OpenAIApi.getInstance()