class File
  constructor: (object) ->
    @id = object.id
    @name = object.name
    @icon = object.icon
    @screenshot = object.screenshot
    @startFrom = object.start_from
    @isPlayable = object.is_mp4_available || object.content_type == 'video/mp4'
    @fileType = switch object.file_type
                  when 0 then 'directory'
                  when 3 then 'movie'
                  else 'other'

  isUsable: () ->
    @fileType != 'other'
