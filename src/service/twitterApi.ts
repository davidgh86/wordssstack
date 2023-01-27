class TwitterApi {

    private static instance: TwitterApi;


    public static getInstance(): TwitterApi {
        if (!TwitterApi.instance) {
            TwitterApi.instance = new TwitterApi()
        }
        
        return TwitterApi.instance
    }

    public getEmbbededTwitter(url: string):Promise<string> {
        return new Promise((resolve, reject) => {

            fetch(url)
            .then(response => {
                resolve(response.json().html as string)
            })
            .catch(error => {
                reject(error)
            });
        });
    }

    // public getEmbbededTwitter(url: string):string {
    //     const request = new XMLHttpRequest();
    //     request.open('GET', url, false);  // `false` makes the request synchronous
    //     request.send(null);

    //     if (request.status === 200) {
    //         return JSON.parse(request.responseText).html;
    //     }
    //     else {
    //         throw new Error("Failing getting embedde twitter")
    //     }
    // }

}

export default TwitterApi.getInstance()