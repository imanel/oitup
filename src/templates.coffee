alertTemplate = (title, description) ->
  template = """
  <?xml version='1.0' encoding='UTF-8' ?>
  <document>
    <alertTemplate>
      <title>#{ title }</title>
      <description>#{ description }</description>
    </alertTemplate>
  </document>
  """
  new DOMParser().parseFromString(template, 'application/xml')

convertingTemplate = (progress = 0) ->
  title = "We're converting this file to format playable on Apple TV"
  description = "This can take some time - please return later. <br />Progress: #{progress}%"
  alertTemplate title, description

errorTemplate = (description) ->
  alertTemplate escapeHTML(description), 'You can find help at https://github.com/imanel/oitup/issues'

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
  list = if files.length > 0
    files.map (file) -> listItemTemplate(file)
  else
    [emptyListItemTemplate()]
  new DOMParser().parseFromString(listHeader + list.join('') + listFooter, 'application/xml')

listItemTemplate = (file) ->
  itemHeader = """
  <listItemLockup id='#{ file.id }'>
    <title>#{ file.name }</title>
    <img src="#{ file.icon }" width="60" height="60" />
  """
  itemRelated = if file.fileType == 'movie'
    result = """
    <relatedContent>
      <lockup>
        <img src="#{ file.screenshot }" />
        <description style="tv-text-style: none; font-size: 40;">#{ file.name }<br /><br />File Size: #{ file.size }</description>
      </lockup>
    </relatedContent>
    """
    result += '<decorationImage src="resource://button-more" />' unless file.isPlayable
    result
  else
    """
    <decorationImage src="resource://chevron" />
    <relatedContent>
      <lockup>
        <img src="#{ file.screenshot }" />
        <description style="tv-text-style: none; font-size: 40;">#{ file.name }</description>
      </lockup>
    </relatedContent>
    """
  itemFooter = '</listItemLockup>'
  itemHeader + itemRelated + itemFooter

emptyListItemTemplate = () ->
  """
  <listItemLockup>
    <title>Folder is empty</title>
  </listItemLockup>
  """

loadingTemplate = (title = 'Loading...') ->
    template = """
    <?xml version="1.0" encoding="UTF-8" ?>
      <document>
        <loadingTemplate>
          <activityIndicator>
            <title>#{title}</title>
          </activityIndicator>
        </loadingTemplate>
      </document>
    """
    new DOMParser().parseFromString template, "application/xml"

loginTemplate = () ->
  template = """
  <?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <formTemplate>
      <banner>
        <title>Put.io Login</title>
        <description>In order to use Put.io you will need access token.<br />To obtain one please visit https://imanel.org/oitup and follow instructions visible on screen.</description>
      </banner>
      <textField>Access Token</textField>
      <footer>
        <button>
          <text>Login</text>
        </button>
      </footer>
    </formTemplate>
  </document>
  """
  new DOMParser().parseFromString template, "application/xml"
