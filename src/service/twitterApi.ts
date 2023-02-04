import { Http } from '@capacitor-community/http';

class TwitterApi {

    private static instance: TwitterApi;


    public static getInstance(): TwitterApi {
        if (!TwitterApi.instance) {
            TwitterApi.instance = new TwitterApi()
        }
        
        return TwitterApi.instance
    }

    public async getEmbbededTwitter(url: string):Promise<any> {
        const options = {
            url: `https://publish.twitter.com/oembed?url=${url}`
        };
        
        const response = await Http.get(options)
        return response.data.html
    }

}

export default TwitterApi.getInstance()