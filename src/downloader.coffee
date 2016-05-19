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

  urlForSetStartFrom: (fileId) ->
    @urlFor '/files/' + fileId + '/start-from/set'

  urlForMP4Status: (fileId) ->
    @urlFor '/files/' + fileId + '/mp4'

  urlForMP4Convert: (fileId) ->
    @urlForMP4Status fileId

  download: (url, callback, method = 'GET') ->
    console.log "Downloading: " + url
    downloadRequest = new XMLHttpRequest()
    downloadRequest.open method, url
    downloadRequest.responseType = 'json'
    downloadRequest.onload = ->
      json = JSON.parse(@responseText)
      callback json
    downloadRequest.onerror = ->
      console.log "Error: " + @responseText
      json = JSON.parse(@responseText)
      if json.error == 'invalid_grant'
        login()
      else
        errorMessage = "Error code: #{json.status_code}, message: #{json.error}"
        navigationDocument.replaceDocument errorTemplate(errorMessage), navigationDocument.documents.slice(-1)[0]
    downloadRequest.send()

  downloadList: (parentId, callback) ->
    @download @urlForList(parentId), (json) ->
      parentName = json.parent.name
      files = json.files.map (f) -> new File(f)
      callback parentName, files.filter (f) -> f.isUsable()

  downloadMP4Status: (fileId, callback) ->
    @download @urlForMP4Status(fileId), (json) ->
      callback json.mp4

  convertMP4: (fileId) ->
    @download @urlForMP4Convert(fileId), (->), 'POST'

  setStartFrom: (fileId, time) ->
    url = @urlForSetStartFrom fileId
    request = new XMLHttpRequest()
    request.open 'POST', url
    request.responseType = 'json'
    request.send 'time=' + time
