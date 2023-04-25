
import elementTemplateParser from '@/service/elementTemplateParser'

describe('html template parser', () => {


  it('shoul get all element', () => {
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

    const result = elementTemplateParser.getTemplates(html)


    console.log(result.image[0])
    expect(result.image.length).toBe(1)
    expect(result.image[0]).toBe('<div>\n      <img class="alignnone size-medium wp-image-6" src="{src_image}" alt="" width="289" height="300">\n    </div>')
    expect(result.video.length).toBe(5)
    expect(result.video[0]).toBe('<div style="width: 100%;height: 100%;overflow: hidden;">\n        <video controls="" style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">\n            <source src="{src_video}" type="video/{video_extension}">\n        </video>\n    </div>')
    expect(result.video[1]).toBe(`[video width="480" height="270" {video_extension}="{src_video}"][/video]`)
    expect(result.video[2]).toBe(`[video {video_extension}="{src_video}"][/video]`)
    expect(result.video[3]).toBe(`[video {video_extension}="{src_video}"][/video]`)
    expect(result.video[4]).toBe(`<div>\n[video {video_extension}="{src_video}"][/video]\n</div>`)
    expect(result.audio[0]).toBe(`[audio {audio_extension}="{src_audio}"][/audio]`)
    expect(result.youtube[0]).toBe('<iframe title="YouTube video player" src="https://www.youtube.com/embed/{youtube_video_id}" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>')
    expect(result.strawpoll[0]).toBe("<iframe width=\"620\" height=\"512\" src=\"{strawpoll_embed_url}\" style=\"width: 100%; height: 515px;\" frameborder=\"0\" allowfullscreen=\"\"></iframe>")
    expect(result.html.length).toBe(5)
    expect(result.html[0]).toBe('vamos a probar\n\n    \n<a href="https://finofilipino.org/">finofilipino</a>')
    expect(result.html[1]).toBe(`adfsdafdsas`)
    expect(result.html[2]).toBe(`adfa`)
    expect(result.html[3]).toBe(`ewrefew`)
    expect(result.html[4]).toBe(`erwtqwerqrwe`)
    expect(result.twitter[0]).toBe('<div>\n      <div>\n        {content}\n        \n      </div>\n    </div>')
  })
})
