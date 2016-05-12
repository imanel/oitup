App.onLaunch = (options) ->
  downloader = new Downloader localStorage.getItem('putioAccessToken')
  downloader.downloadList null, (header, files) ->
    list = createList header, files
    navigationDocument.pushDocument list

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->
