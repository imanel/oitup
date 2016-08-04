App.onLaunch = (options) ->
  @location = options.location
  @location = @location.substring 0, @location.indexOf('application.js')
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
