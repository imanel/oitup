App.onLaunch = (options) ->
  downloader = new Downloader localStorage.getItem('putioAccessToken')
  alert = createAlert 'Put.IO Token', downloader.urlForList()
  navigationDocument.pushDocument alert

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->
