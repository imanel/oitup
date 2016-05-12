selectFile = (event) ->
  fileId = event.target.getAttribute 'id'
  file = File.files[fileId]
  switch file.fileType
    when 'movie' then file.play()
    when 'directory' then openDirectory(file)

openDirectory = (id) ->

escapeHTML = (string) ->
  String(string).replace /[\"&<>]/g, (chr) -> { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[chr]
