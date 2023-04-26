import elementTemplateParser from "../elementTemplateParser";

class TemplateLoaderService {

    private static instance: TemplateLoaderService;

    public static getInstance() {
        if (!TemplateLoaderService.instance) {
            TemplateLoaderService.instance = new TemplateLoaderService()
        }
        return TemplateLoaderService.instance
    }

    public inferTemplates() {
        const html = `vamos a probar

        <a href="https://finofilipino.org/">finofilipino</a>
        
        &nbsp;
        
        <iframe title="YouTube video player" src="https://www.youtube.com/embed/VBfaflpB1U0" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
        <div>
        <div>
            <blockquote class="twitter-tweet">
            <p dir="ltr" lang="en">Sunsets don't get much better than this one over <a href="https://twitter.com/GrandTetonNPS?ref_src=twsrc%5Etfw">@GrandTetonNPS</a>. <a href="https://twitter.com/hashtag/nature?src=hash&amp;ref_src=twsrc%5Etfw">#nature</a> <a href="https://twitter.com/hashtag/sunset?src=hash&amp;ref_src=twsrc%5Etfw">#sunset</a> <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a></p>
            — US Department of the Interior (@Interior) <a href="https://twitter.com/Interior/status/463440424141459456?ref_src=twsrc%5Etfw">May 5, 2014</a></blockquote>
            <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
        </div>
        
        <div>
        <img class="alignnone size-medium wp-image-6" src="http://localhost:9090/wp-content/uploads/2023/04/werfqercrwstg-289x300.jpg" alt="" width="289" height="300" />
        </div>
        
        &nbsp;
        
        [audio mp3="http://localhost:9090/wp-content/uploads/2023/04/file_example_MP3_700KB.mp3"][/audio]
        
        adfsdafdsas
        
        &nbsp;

        <div style="width: 100%;height: 100%;overflow: hidden;">
            <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
                <source src="https://videos.files.wordpress.com/2IUdmeVU/fdgshdnfgt.mp4" type="video/mp4">
            </video>
        </div>

        <iframe width="620" height="512" src="https://strawpoll.com/embed/rae5gcp1" style="width: 100%; height: 515px;" frameborder="0" allowfullscreen></iframe>
        adfa[video width="480" height ="270" mp4 = 'http://localhost:9090/wp-content/uploads/2023/04/file_example_MP4_480_1_5MG.mp4'][/video]ewrefew[video avi="https://marca.com/video.avi"][/video]erwtqwerqrwe
        [video avi="https://marca.com/video.avi"][/video]<div>[video avi="https://marca.com/video.avi"][/video]</diV>`

        return elementTemplateParser.getTemplates(html)
    }
}

export default TemplateLoaderService.getInstance()