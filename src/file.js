import * as api from './api'
import Converting from './components/Converting'
import Loading from './components/Loading'

class File {
  constructor(object) {
    this.id = String(object.id)
    this.constructor.files[this.id] = this
    this.name = object.name
    this.startFrom = object.start_from
    this.size = this.calculateSize(object.mp4_size || object.size)
    this.isPlayable = object.is_mp4_available || object.content_type === 'video/mp4'
    switch (object.file_type) {
      case 'VIDEO':
        this.fileType = 'movie'
        this.icon = object.icon
        this.screenshot = object.screenshot
        break
      case 'FOLDER':
        this.fileType = 'directory'
        this.icon = App.location + 'folder_icon.png'
        this.screenshot = App.location + 'folder_screenshot.png'
        break
      default:
        this.fileType = 'other'
    }
  }

  isUsable() {
    return this.fileType !== 'other'
  }

  play() {
    if (!this.isPlayable) {
      showConvertingProgress()
      return
    }
    const video = new MediaItem('video', api.urlForMovie(this.id))
    video.title = this.name
    video.artworkImageURL = this.screenshot
    video.resumeTime = this.startFrom
    const player = new Player()
    player.playlist = new Playlist()
    player.playlist.push(video)
    player.addEventListener("timeDidChange", (event) => {
      this.updateStartFrom(event.time)
    }, {
      interval: 10
    })
    player.play()
  }

  showConvertingProgress() {
    const loadingDocument = Loading()
    navigationDocument.pushDocument(loadingDocument)
    api.downloadMP4Status(this.id, (response) => {
      if (response.status === 'COMPLETED') {
        this.isPlayable = true
        navigationDocument.popDocument()
        this.play()
      } else {
        if (response.status === 'NOT_AVAILABLE') {
          api.convertMP4(this.id)
        }
        navigationDocument.replaceDocument(Converting(response.percent_done || 0), loadingDocument)
      }
    })
  }

  updateStartFrom(time) {
    this.startFrom = time
    api.setStartFrom(this.id, time)
  }

  calculateSize(size) {
    let bytes
    if      (size >= 1000000000) { bytes = (size/1000000000).toFixed(1) + ' GB' }
    else if (size >= 1000000)    { bytes = (size/1000000).toFixed(1) + ' MB' }
    else if (size >= 1000)       { bytes = (size/1000).toFixed(1) + ' KB' }
    else if (size >  1)          { bytes = size + ' bytes' }
    else if (size == 1)          { bytes = size + ' byte' }
    else                         { bytes = '0 byte' }
    return bytes
  }
}

File.files = {}

export default File
