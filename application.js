App.onLaunch = function(options) {
  var downloader;
  downloader = new Downloader(localStorage.getItem('putioAccessToken'));
  return downloader.downloadList(null, function(header, files) {
    var list;
    list = listTemplate(header, files);
    list.addEventListener("select", selectFile);
    list.addEventListener("play", selectFile);
    return navigationDocument.pushDocument(list);
  });
};

App.onWillResignActive = function() {};

App.onDidEnterBackground = function() {};

App.onWillEnterForeground = function() {};

App.onDidBecomeActive = function() {};

App.onWillTerminate = function() {};

var Downloader;

Downloader = (function() {
  function Downloader(accessToken) {
    this.accessToken = accessToken;
  }

  Downloader.prototype.baseURL = 'https://api.put.io/v2';

  Downloader.prototype.urlFor = function(path) {
    var operator;
    operator = path.indexOf('?') > -1 ? '&' : '?';
    return this.baseURL + path + operator + 'oauth_token=' + this.accessToken;
  };

  Downloader.prototype.urlForList = function(parentId) {
    var path;
    path = '/files/list';
    if (parentId) {
      path += '?parent_id=' + parentId;
    }
    return this.urlFor(path);
  };

  Downloader.prototype.urlForMovie = function(fileId) {
    return this.urlFor('/files/' + fileId + '/hls/media.m3u8?subtitle_key=all');
  };

  Downloader.prototype.urlForSetStartFrom = function(fileId) {
    return this.urlFor('/files/' + fileId + '/start-from/set');
  };

  Downloader.prototype.download = function(url, callback) {
    var downloadRequest, self;
    self = this;
    downloadRequest = new XMLHttpRequest();
    downloadRequest.open('GET', url);
    downloadRequest.responseType = 'json';
    downloadRequest.onload = function() {
      var files, json, parentName;
      json = JSON.parse(this.responseText);
      parentName = json.parent.name;
      files = json.files.map((function(_this) {
        return function(f) {
          return new File(self, f);
        };
      })(this));
      return callback(parentName, files.filter(function(f) {
        return f.isUsable();
      }));
    };
    downloadRequest.onerror = function() {
      return console.log(downloadRequest);
    };
    return downloadRequest.send();
  };

  Downloader.prototype.downloadList = function(parentId, callback) {
    return this.download(this.urlForList(parentId), callback);
  };

  Downloader.prototype.setStartFrom = function(fileId, time) {
    var request, url;
    url = this.urlForSetStartFrom(fileId);
    request = new XMLHttpRequest();
    request.open('POST', url);
    request.responseType = 'json';
    return request.send('time=' + time);
  };

  return Downloader;

})();

var File;

File = (function() {
  File.files = {};

  function File(downloader, object) {
    this.downloader = downloader;
    this.id = String(object.id);
    this.constructor.files[this.id] = this;
    this.name = object.name;
    this.icon = object.icon;
    this.screenshot = object.screenshot;
    this.startFrom = object.start_from;
    this.isPlayable = object.is_mp4_available || object.content_type === 'video/mp4';
    this.fileType = (function() {
      switch (object.file_type) {
        case 0:
          return 'directory';
        case 3:
          return 'movie';
        default:
          return 'other';
      }
    })();
  }

  File.prototype.isUsable = function() {
    return this.fileType !== 'other';
  };

  File.prototype.url = function() {
    return this.downloader.urlForMovie(this.id);
  };

  File.prototype.play = function() {
    var player, video;
    video = new MediaItem('video', this.downloader.urlForMovie(this.id));
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
  };

  File.prototype.updateStartFrom = function(time) {
    this.startFrom = time;
    return this.downloader.setStartFrom(this.id, time);
  };

  return File;

})();

var alertTemplate, listItemTemplate, listTemplate;

alertTemplate = function(title, description) {
  var alertString, parser;
  alertString = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + (escapeHTML(title)) + "</title>\n    <description>" + (escapeHTML(description)) + "</description>\n  </alertTemplate>\n</document>";
  parser = new DOMParser();
  return parser.parseFromString(alertString, 'application/xml');
};

listTemplate = function(title, files) {
  var list, listFooter, listHeader, parser;
  listHeader = "<?xml version='1.0' encoding='UTF-8' ?>\n  <document>\n  <listTemplate>\n    <list>\n      <header>\n        <title>" + title + "</title>\n      </header>\n      <section>";
  listFooter = "      </section>\n    </list>\n  </listTemplate>\n</document>";
  list = files.map(function(file) {
    return listItemTemplate(file);
  });
  parser = new DOMParser();
  return parser.parseFromString(listHeader + list.join('') + listFooter, 'application/xml');
};

listItemTemplate = function(file) {
  var itemFooter, itemHeader, itemRelated;
  itemHeader = "<listItemLockup id='" + file.id + "'>\n  <title>" + file.name + "</title>\n  <img src=\"" + file.icon + "\" width=\"60\" height=\"60\" />";
  itemRelated = file.fileType === 'movie' ? "<relatedContent>\n  <lockup>\n    <img src=\"" + file.screenshot + "\" />\n    <description>" + file.name + "</description>\n  </lockup>\n</relatedContent>" : '<decorationImage src="resource://chevron" />';
  itemFooter = '</listItemLockup>';
  return itemHeader + itemRelated + itemFooter;
};

var escapeHTML, openDirectory, selectFile;

selectFile = function(event) {
  var file, fileId;
  fileId = event.target.getAttribute('id');
  file = File.files[fileId];
  switch (file.fileType) {
    case 'movie':
      return file.play();
    case 'directory':
      return openDirectory(file);
  }
};

openDirectory = function(id) {};

escapeHTML = function(string) {
  return String(string).replace(/[\"&<>]/g, function(chr) {
    return {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }[chr];
  });
};
