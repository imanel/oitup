downloadList = (listId) ->
  loadingDocument = loadingTemplate()
  navigationDocument.pushDocument loadingDocument

  App.downloader.downloadList listId, (header, files) ->
    list = listTemplate header, files

    list.addEventListener "select", selectFile
    list.addEventListener "play", selectFile

    if loadingDocument
      navigationDocument.replaceDocument list, loadingDocument
    else
      navigationDocument.pushDocument list

selectFile = (event) ->
  fileId = event.target.getAttribute 'id'
  file = File.files[fileId]
  switch file.fileType
    when 'movie' then file.play()
    when 'directory' then downloadList(file.id)

escapeHTML = (string) ->
  String(string).replace /[\"&<>]/g, (chr) -> { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[chr]

login = () ->
  loginView = loginTemplate()
  tokenField = loginView.getElementsByTagName('textField').item(0)
  loginView.addEventListener "select", -> handleLogin(tokenField)
  loginView.addEventListener "play", -> handleLogin(tokenField)
  navigationDocument.pushDocument loginView

handleLogin = (tokenField) ->
  token = tokenField.getFeature('Keyboard').text
  localStorage.setItem('putioAccessToken', token)
  App.downloader = new Downloader token
  navigationDocument.clear()
  downloadList null
