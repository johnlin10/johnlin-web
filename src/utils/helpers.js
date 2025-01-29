import { customAlphabet } from 'nanoid'

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

/**
 * check if the url is a valid url
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * generate a nanoid
 * @param {number} length
 * @returns {string}
 */
export function generateNanoId(length = 12) {
  const alphabet =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nanoid = customAlphabet(alphabet, length)
  return nanoid()
}
