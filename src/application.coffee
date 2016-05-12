App.onLaunch = (options) ->
  alert = createAlert('Put.IO Token', localStorage.getItem('putioAccessToken'))
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
         <title>#{ title }</title>
         <description>#{ description }</description>
       </alertTemplate>
     </document>
  """
  parser = new DOMParser()
  parser.parseFromString(alertString, 'application/xml')
