App.onLaunch = (options) ->
  @downloader = new Downloader localStorage.getItem('putioAccessToken')
  @background = 'https://bit.ly/1T8Rz1S'
  downloadList null

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->
  if navigationDocument.documents.length == 1
    navigationDocument.clear()
    downloadList null

App.onDidBecomeActive = ->

App.onWillTerminate = ->
