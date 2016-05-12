App.onLaunch = (options) ->
  @downloader = new Downloader localStorage.getItem('putioAccessToken')
  downloadList null

App.onWillResignActive = ->

App.onDidEnterBackground = ->

App.onWillEnterForeground = ->

App.onDidBecomeActive = ->

App.onWillTerminate = ->
