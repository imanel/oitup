App.onLaunch = (options) ->
  downloader = new Downloader localStorage.getItem('putioAccessToken')
  downloader.downloadList null, (data) ->
    alert = createAlert 'Put.IO Data', data
    navigationDocument.pushDocument alert

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->
