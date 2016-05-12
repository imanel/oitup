createAlert = (title, description) ->
  alertString = """
     <?xml version='1.0' encoding='UTF-8' ?>
     <document>
       <alertTemplate>
         <title>#{ escapeHTML title }</title>
         <description>#{ escapeHTML description }</description>
       </alertTemplate>
     </document>
  """
  parser = new DOMParser()
  parser.parseFromString(alertString, 'application/xml')

createList = (title, files) ->
  listHeader = """
    <?xml version='1.0' encoding='UTF-8' ?>
      <document>
      <listTemplate>
        <list>
          <header>
            <title>#{ title }</title>
          </header>
          <section>
  """
  listFooter = """
          </section>
        </list>
      </listTemplate>
    </document>
  """
  list = files.map (file) -> createListItem(file)
  parser = new DOMParser()
  parser.parseFromString(listHeader + list.join('') + listFooter, 'application/xml')

createListItem = (file) ->
  itemHeader = """
  <listItemLockup id='#{ file.id }'>
    <title>#{ file.name }</title>
    <img src="#{ file.icon }" width="60" height="60" />
  """
  itemRelated = if file.fileType == 'movie'
    """
    <relatedContent>
      <lockup>
        <img src="#{ file.screenshot }" />
        <description>#{ file.name }</description>
      </lockup>
    </relatedContent>
    """
  else
    '<decorationImage src="resource://chevron" />'
  itemFooter = '</listItemLockup>'
  itemHeader + itemRelated + itemFooter

selectFile = (event) ->
  fileId = event.target.getAttribute 'id'
  file = File.files[fileId]
  switch file.fileType
    when 'movie' then file.play()
    when 'directory' then openDirectory(file)

openDirectory = (id) ->

escapeHTML = (string) ->
  String(string).replace /[\"&<>]/g, (chr) -> { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[chr]
