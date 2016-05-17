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

  download: (url, callback) ->
    console.log "Downloading: " + url
    self = @
    downloadRequest = new XMLHttpRequest()
    downloadRequest.open 'GET', url
    downloadRequest.responseType = 'json'
    downloadRequest.onload = ->
      json = JSON.parse(@responseText)
      parentName = json.parent.name
      files = json.files.map (f) => new File(self, f)
      callback parentName, files.filter (f) -> f.isUsable()
    downloadRequest.onerror = ->
      console.log "Error: " + @responseText
      json = JSON.parse(@responseText)
      if json.error == 'invalid_grant'
        login()
      else
        errorMessage = "Error code: #{json.status_code}, message: #{json.error}"
        navigationDocument.replaceDocument alertTemplate('An error occured', errorMessage), navigationDocument.documents.slice(-1)[0]
    downloadRequest.send()

  downloadList: (parentId, callback) ->
    @download @urlForList(parentId), callback

  setStartFrom: (fileId, time) ->
    url = @urlForSetStartFrom fileId
    request = new XMLHttpRequest()
    request.open 'POST', url
    request.responseType = 'json'
    request.send 'time=' + time
