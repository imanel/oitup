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

escapeHTML = (string) ->
  String(string).replace /[\"&<>]/g, (chr) -> { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[chr]
