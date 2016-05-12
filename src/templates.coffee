alertTemplate = (title, description) ->
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

listTemplate = (title, files) ->
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
  list = files.map (file) -> listItemTemplate(file)
  parser = new DOMParser()
  parser.parseFromString(listHeader + list.join('') + listFooter, 'application/xml')

listItemTemplate = (file) ->
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
