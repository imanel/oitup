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
  new DOMParser().parseFromString(alertString, 'application/xml')

listTemplate = (title, files) ->
  listHeader = """
  <?xml version='1.0' encoding='UTF-8' ?>
    <document>
    <listTemplate>
      <background>
        <heroImg src="#{ App.background }" />
      </background>
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
  new DOMParser().parseFromString(listHeader + list.join('') + listFooter, 'application/xml')

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
        <description>#{ file.name }<br />#{ file.duration }</description>
      </lockup>
    </relatedContent>
    """
  else
    """
    <decorationImage src="resource://chevron" />
    <relatedContent>
      <lockup>
      </lockup>
    </relatedContent>
    """
  itemFooter = '</listItemLockup>'
  itemHeader + itemRelated + itemFooter

loadingTemplate = (title = 'Loading...') ->
    template = """
    <?xml version="1.0" encoding="UTF-8" ?>
      <document>
        <loadingTemplate>
          <background>
            <heroImg src="#{ App.background }" />
          </background>
          <activityIndicator>
            <title>#{title}</title>
          </activityIndicator>
        </loadingTemplate>
      </document>
    """
    new DOMParser().parseFromString template, "application/xml"
