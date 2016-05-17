App.onLaunch = (options) ->
  @downloader = new Downloader localStorage.getItem('putioAccessToken')
  downloadList null

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->
  if navigationDocument.documents.length == 1
    navigationDocument.clear()
    downloadList null

App.onDidBecomeActive = ->

App.onWillTerminate = ->
