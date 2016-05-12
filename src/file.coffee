class File
  @files = {}

  constructor: (@downloader, object) ->
    @id = String(object.id)
    @constructor.files[@id] = @

    @name = object.name
    @icon = object.icon
    @screenshot = object.screenshot
    @startFrom = object.start_from
    @duration = @calculateDuration(object.video_metadata?.duration)
    @isPlayable = object.is_mp4_available || object.content_type == 'video/mp4'
    @fileType = switch object.file_type
                  when 0 then 'directory'
                  when 3 then 'movie'
                  else 'other'

  isUsable: () ->
    @fileType != 'other'

  play: () ->
    video = new MediaItem 'video', @downloader.urlForMovie(@id)
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

  updateStartFrom: (time) ->
    @startFrom = time
    @downloader.setStartFrom @id, time

  calculateDuration: (duration) ->
    hours = parseInt( duration / 3600 )
    minutes = parseInt( duration / 60 ) % 60
    result = ""
    result += hours + " hr " if hours > 0
    result + minutes + " min"
