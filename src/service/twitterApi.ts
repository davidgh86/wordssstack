class TwitterApi {

    private static instance: TwitterApi;


    public static getInstance(): TwitterApi {
        if (!TwitterApi.instance) {
            TwitterApi.instance = new TwitterApi()
        }
        
        return TwitterApi.instance
    }

    // public getEmbbededTwitter(url: string):Promise<any> {
    //     return new Promise((resolve, reject) => {

    //         fetch(`https://publish.twitter.com/oembed?url=${url}`)
    //         .then(response => {
    //             resolve(response.json().then(resp => resolve(resp.html as string)).catch(err => reject(err)));
    //         })
    //         .catch(error => {
    //             reject(error)
    //         });
    //     });
    // }

    public getEmbbededTwitter(url: string):string {
        debugger;
        alert("here " + url)
        alert("url " + `https://publish.twitter.com/oembed?url=${url}`)
        const request = new XMLHttpRequest();
        request.open('GET', `https://publish.twitter.com/oembed?url=${url}`, false);  // `false` makes the request synchronous
        try {
            request.send(null);
        }catch(error) {
            alert(JSON.stringify(error))
        }

        if (request.status === 200) {
            alert(request.responseText)
            return JSON.parse(request.responseText).html;
        }
        else {
            alert("Failed")
            alert(request.responseText)
            throw new Error("Failing getting embedde twitter")
        }
    }

}

export default TwitterApi.getInstance()