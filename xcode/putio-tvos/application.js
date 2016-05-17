App.onLaunch = function(options) {
  this.downloader = new Downloader(localStorage.getItem('putioAccessToken'));
  this.background = 'https://bit.ly/1T8Rz1S';
  return downloadList(null);
};

App.onWillResignActive = function() {};

App.onDidEnterBackground = function() {};

App.onWillEnterForeground = function() {
  if (navigationDocument.documents.length === 1) {
    navigationDocument.clear();
    return downloadList(null);
  }
};

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
    console.log("Downloading: " + url);
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
      var errorMessage, json;
      console.log("Error: " + this.responseText);
      json = JSON.parse(this.responseText);
      errorMessage = "Error code: " + json.status_code + ", message: " + json.error;
      return navigationDocument.replaceDocument(alertTemplate('An error occured', errorMessage), navigationDocument.documents.slice(-1)[0]);
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
    var ref;
    this.downloader = downloader;
    this.id = String(object.id);
    this.constructor.files[this.id] = this;
    this.name = object.name;
    this.icon = object.icon;
    this.screenshot = object.screenshot;
    this.startFrom = object.start_from;
    this.duration = this.calculateDuration((ref = object.video_metadata) != null ? ref.duration : void 0);
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

  File.prototype.calculateDuration = function(duration) {
    var hours, minutes, result;
    hours = parseInt(duration / 3600);
    minutes = parseInt(duration / 60) % 60;
    result = "";
    if (hours > 0) {
      result += hours + " hr ";
    }
    return result + minutes + " min";
  };

  return File;

})();

var alertTemplate, listItemTemplate, listTemplate, loadingTemplate;

alertTemplate = function(title, description) {
  var alertString;
  alertString = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + (escapeHTML(title)) + "</title>\n    <description>" + (escapeHTML(description)) + "</description>\n  </alertTemplate>\n</document>";
  return new DOMParser().parseFromString(alertString, 'application/xml');
};

listTemplate = function(title, files) {
  var list, listFooter, listHeader;
  listHeader = "<?xml version='1.0' encoding='UTF-8' ?>\n  <document>\n  <listTemplate>\n    <background>\n      <heroImg src=\"" + App.background + "\" />\n    </background>\n    <list>\n      <header>\n        <title>" + title + "</title>\n      </header>\n      <section>";
  listFooter = "      </section>\n    </list>\n  </listTemplate>\n</document>";
  list = files.map(function(file) {
    return listItemTemplate(file);
  });
  return new DOMParser().parseFromString(listHeader + list.join('') + listFooter, 'application/xml');
};

listItemTemplate = function(file) {
  var itemFooter, itemHeader, itemRelated;
  itemHeader = "<listItemLockup id='" + file.id + "'>\n  <title>" + file.name + "</title>\n  <img src=\"" + file.icon + "\" width=\"60\" height=\"60\" />";
  itemRelated = file.fileType === 'movie' ? "<relatedContent>\n  <lockup>\n    <img src=\"" + file.screenshot + "\" />\n    <description>" + file.name + "<br />" + file.duration + "</description>\n  </lockup>\n</relatedContent>" : "<decorationImage src=\"resource://chevron\" />\n<relatedContent>\n  <lockup>\n  </lockup>\n</relatedContent>";
  itemFooter = '</listItemLockup>';
  return itemHeader + itemRelated + itemFooter;
};

loadingTemplate = function(title) {
  var template;
  if (title == null) {
    title = 'Loading...';
  }
  template = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n  <document>\n    <loadingTemplate>\n      <background>\n        <heroImg src=\"" + App.background + "\" />\n      </background>\n      <activityIndicator>\n        <title>" + title + "</title>\n      </activityIndicator>\n    </loadingTemplate>\n  </document>";
  return new DOMParser().parseFromString(template, "application/xml");
};

var downloadList, escapeHTML, selectFile;

downloadList = function(listId) {
  var loadingDocument;
  loadingDocument = loadingTemplate();
  navigationDocument.pushDocument(loadingDocument);
  return App.downloader.downloadList(listId, function(header, files) {
    var list;
    list = listTemplate(header, files);
    list.addEventListener("select", selectFile);
    list.addEventListener("play", selectFile);
    if (loadingDocument) {
      return navigationDocument.replaceDocument(list, loadingDocument);
    } else {
      return navigationDocument.pushDocument(list);
    }
  });
};

selectFile = function(event) {
  var file, fileId;
  fileId = event.target.getAttribute('id');
  file = File.files[fileId];
  switch (file.fileType) {
    case 'movie':
      return file.play();
    case 'directory':
      return downloadList(file.id);
  }
};

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
