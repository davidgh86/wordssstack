import { mount } from '@vue/test-utils'
import FolderPage from '@/views/FolderPage.vue'
import YoutubeStackElement from '@/wordpressstack/youtubeStackElement'

describe('FolderPage.vue', () => {

// var url = 'http://youtube.googleapis.com/v/4e_kz79tjb8?version=3';
// url = 'https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M';
// url = 'http://www.youtube.com/watch?feature=player_embedded&v=Ab25nviakcw#';
// url = 'http://youtu.be/Ab25nviakcw';
// url = 'http://www.youtube.com/watch?v=Ab25nviakcw';
// url = '<iframe width="420" height="315" src="http://www.youtube.com/embed/Ab25nviakcw" frameborder="0" allowfullscreen></iframe>';
// url = '<object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="420" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
// url = 'http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg';
// url = 'https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit';
// url = 'BGL22PTIOAM';
  function test(url, result) {
    const youtubeStackElement: YoutubeStackElement = new YoutubeStackElement(url)
    const id = youtubeStackElement.getYoutubeVideoId()
    expect(id).toBe(result)
  }
  it('1', () => {
    const youtubeStackElement: YoutubeStackElement = new YoutubeStackElement('http://youtube.googleapis.com/v/4e_kz79tjb8?version=3')
    const id = youtubeStackElement.getYoutubeVideoId()
    expect(id).toBe('BGL22PTIOAM')
    //test('http://youtube.googleapis.com/v/4e_kz79tjb8?version=3', 'BGL22PTIOAM')
  })

  // it('2', () => {
  //   test('https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M', 'BGL22PTIOAM')
  // })

  // it('3', () => {
  //   test('http://youtu.be/Ab25nviakcw', 'BGL22PTIOAM')
  // })

  // it('4', () => {
  //   test('http://www.youtube.com/watch?v=Ab25nviakcw', 'BGL22PTIOAM')
  // })

  // it('5', () => {
  //   test('<iframe width="420" height="315" src="http://www.youtube.com/embed/Ab25nviakcw" frameborder="0" allowfullscreen></iframe>', 'BGL22PTIOAM')
  // })

  // it('6', () => {
  //   test('<object width="420" height="315"><param name="movie" value="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube-nocookie.com/v/Ab25nviakcw?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="420" height="315" allowscriptaccess="always" allowfullscreen="true"></embed></object>', 'BGL22PTIOAM')
  // })

  // it('7', () => {
  //   test('http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg', 'BGL22PTIOAM')
  // })

  // it('8', () => {
  //   test('https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit', 'BGL22PTIOAM')
  // })

  // it('9', () => {
  //   test('BGL22PTIOAM', 'BGL22PTIOAM')
  // })
})
