App.onLaunch = (options) ->
  downloader = new Downloader localStorage.getItem('putioAccessToken')
  downloader.downloadList null, (data) ->
    alert = createAlert 'Put.IO Data', data.map (d) -> d.fileType
    navigationDocument.pushDocument alert

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->
