App.onLaunch = (options) ->
  downloader = new Downloader localStorage.getItem('putioAccessToken')
  alert = createAlert 'Put.IO Token', downloader.urlForList()
  navigationDocument.pushDocument alert

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->

createAlert = (title, description) ->
  alertString = """
     <?xml version='1.0' encoding='UTF-8' ?>
     <document>
       <alertTemplate>
         <title>#{ escapeHTML title }</title>
         <description>#{ escapeHTML description }</description>
       </alertTemplate>
     </document>
  """
  parser = new DOMParser()
  parser.parseFromString(alertString, 'application/xml')

escapeHTML = (string) ->
  String(string).replace /[\"&<>]/g, (chr) -> { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[chr]

class Downloader
  constructor: (@accessToken) ->

  baseURL: 'https://api.put.io/v2'

  url: (path) ->
    operator = if path.indexOf('?') > -1 then '&' else '?'
    @baseURL + path + operator + 'oauth_token=' + @accessToken

  urlForList: (parentId) ->
    path = '/files/list'
    path += '?parent_id=' + parentId if parentId
    @url(path)

  urlForMovie: (fileId) ->
    @url("/files/#{ fileId }/hls/media.m3u8?subtitle_key=all")
