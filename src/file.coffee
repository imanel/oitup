class File
  @files = {}

  constructor: (object) ->
    @id = String(object.id)
    @constructor.files[@id] = @

    @name = object.name
    @icon = object.icon
    @screenshot = object.screenshot
    @startFrom = object.start_from
    @size = @calculateSize(object.mp4_size || object.size)
    @isPlayable = object.is_mp4_available || object.content_type == 'video/mp4'
    @fileType = switch object.file_type
                  when 'FOLDER' then 'directory'
                  when 'VIDEO' then 'movie'
                  else 'other'

  isUsable: () ->
    @fileType != 'other'

  play: () ->
    if @isPlayable
      video = new MediaItem 'video', App.downloader.urlForMovie(@id)
      video.title = @name
      video.artworkImageURL = @screenshot
      video.resumeTime = @startFrom

      player = new Player()
      player.playlist = new Playlist()
      player.playlist.push video

      player.addEventListener "timeDidChange", ((event) =>
        @updateStartFrom event.time
      ), { interval: 10 }

      player.play()
    else
      loadingDocument = loadingTemplate()
      navigationDocument.pushDocument loadingDocument
      App.downloader.downloadMP4Status @id, (response) =>
        if response.status == 'COMPLETED'
          @isPlayable = true
          navigationDocument.popDocument()
          @play()
        else
          App.downloader.convertMP4 @id if response.status == 'NOT_AVAILABLE'
          navigationDocument.replaceDocument convertingTemplate(response.percent_done || 0), loadingDocument

  updateStartFrom: (time) ->
    @startFrom = time
    App.downloader.setStartFrom @id, time

  calculateSize: (size) ->
    kb = ( size / 1024 ).toFixed 1
    mb = ( kb / 1024 ).toFixed 1
    gb = ( mb / 1024 ).toFixed 1
    tb = ( gb / 1024 ).toFixed 1
    if tb >= 1
      "#{tb} TB"
    else if gb >= 1
      "#{gb} GB"
    else if mb >= 1
      "#{mb} MB"
    else if kb >= 1
      "#{kb} kB"
    else
      "#{size} bytes"
