import Downloader from './downloader'
import { convertingTemplate, loadingTemplate } from './templates'

class File {
  constructor(object) {
    this.id = String(object.id);
    this.constructor.files[this.id] = this;
    this.name = object.name;
    this.startFrom = object.start_from;
    this.size = this.calculateSize(object.mp4_size || object.size);
    this.isPlayable = object.is_mp4_available || object.content_type === 'video/mp4';
    switch (object.file_type) {
      case 'VIDEO':
        this.fileType = 'movie';
        this.icon = object.icon;
        this.screenshot = object.screenshot;
        break;
      case 'FOLDER':
        this.fileType = 'directory';
        this.icon = App.location + 'folder_icon.png';
        this.screenshot = App.location + 'folder_screenshot.png';
        break;
      default:
        this.fileType = 'other';
    }
  }

  isUsable() {
    return this.fileType !== 'other';
  };

  play() {
    var loadingDocument, player, video;
    if (this.isPlayable) {
      video = new MediaItem('video', Downloader.urlForMovie(this.id));
      video.title = this.name;
      video.artworkImageURL = this.screenshot;
      video.resumeTime = this.startFrom;
      player = new Player();
      player.playlist = new Playlist();
      player.playlist.push(video);
      player.addEventListener("timeDidChange", ((function(_this) {
        return function(event) {
          return _this.updateStartFrom(event.time);
        };
      })(this)), {
        interval: 10
      });
      return player.play();
    } else {
      loadingDocument = loadingTemplate();
      navigationDocument.pushDocument(loadingDocument);
      return Downloader.downloadMP4Status(this.id, (function(_this) {
        return function(response) {
          if (response.status === 'COMPLETED') {
            _this.isPlayable = true;
            navigationDocument.popDocument();
            return _this.play();
          } else {
            if (response.status === 'NOT_AVAILABLE') {
              Downloader.convertMP4(_this.id);
            }
            return navigationDocument.replaceDocument(convertingTemplate(response.percent_done || 0), loadingDocument);
          }
        };
      })(this));
    }
  };

  updateStartFrom(time) {
    this.startFrom = time;
    return Downloader.setStartFrom(this.id, time);
  };

  calculateSize(size) {
    var gb, kb, mb, tb;
    kb = (size / 1024).toFixed(1);
    mb = (kb / 1024).toFixed(1);
    gb = (mb / 1024).toFixed(1);
    tb = (gb / 1024).toFixed(1);
    if (tb >= 1) {
      return tb + " TB";
    } else if (gb >= 1) {
      return gb + " GB";
    } else if (mb >= 1) {
      return mb + " MB";
    } else if (kb >= 1) {
      return kb + " kB";
    } else {
      return size + " bytes";
    }
  };
}

File.files = {}

export default File
