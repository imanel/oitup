class Downloader
  constructor: (@accessToken) ->

  baseURL: 'https://api.put.io/v2'

  urlFor: (path) ->
    operator = if path.indexOf('?') > -1 then '&' else '?'
    @baseURL + path + operator + 'oauth_token=' + @accessToken

  urlForList: (parentId) ->
    path = '/files/list'
    path += '?parent_id=' + parentId if parentId
    @urlFor path

  urlForMovie: (fileId) ->
    @urlFor '/files/' + fileId + '/hls/media.m3u8?subtitle_key=all'

  download: (url, callback) ->
    downloadRequest = new XMLHttpRequest()
    downloadRequest.open 'GET', url
    downloadRequest.responseType = 'json'
    downloadRequest.onload = ->
      files = JSON.parse(@responseText).files.map (f) -> new File(f)
      console.log files.filter (f) -> f.isUsable()
      callback files.filter (f) -> f.isUsable()
    downloadRequest.onerror = ->
      console.log downloadRequest
    downloadRequest.send()

  downloadList: (parentId, callback) ->
    @download @urlForList(parentId), callback
