/**
 * check if the url is a youtube url
 * @param {string} url
 * @returns {boolean}
 */
export function isYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  return youtubeRegex.test(url)
}

/**
 * get the youtube embed url
 * @param {string} url
 * @returns {string}
 */
export function getYouTubeEmbedUrl(url) {
  const videoId = url.split('v=')[1] || url.split('/').pop()
  return `https://www.youtube.com/embed/${videoId}`
}
