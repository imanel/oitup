import { download, urlFor } from './util'

export const urlForMovie = (fileId) => urlFor(`/files/${fileId}/hls/media.m3u8?subtitle_key=all`)

const urlForSetStartFrom = (fileId) => urlFor(`/files/${fileId}/start-from/set`)

const urlForMP4Status = (fileId) => urlFor(`/files/${fileId}/mp4`)

const urlForMP4Convert = (fileId) => urlForMP4Status(fileId)

export const downloadMP4Status = (fileId, callback) => {
  return download(urlForMP4Status(fileId), function(json) {
    return callback(json.mp4)
  })
}

export const convertMP4 = (fileId) => {
  return download(urlForMP4Convert(fileId), (function() {}), 'POST')
}

export const setStartFrom = (fileId, time) => {
  const url = urlForSetStartFrom(fileId)
  const request = new XMLHttpRequest()
  request.open('POST', url)
  request.responseType = 'json'
  return request.send('time=' + time)
}
