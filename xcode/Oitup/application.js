App.onLaunch = function(options) {
  this.downloader = new Downloader(localStorage.getItem('putioAccessToken'));
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

  Downloader.prototype.urlForMP4Status = function(fileId) {
    return this.urlFor('/files/' + fileId + '/mp4');
  };

  Downloader.prototype.urlForMP4Convert = function(fileId) {
    return this.urlForMP4Status(fileId);
  };

  Downloader.prototype.download = function(url, callback, method) {
    var downloadRequest;
    if (method == null) {
      method = 'GET';
    }
    console.log("Downloading: " + url);
    downloadRequest = new XMLHttpRequest();
    downloadRequest.open(method, url);
    downloadRequest.responseType = 'json';
    downloadRequest.onload = function() {
      var json;
      json = JSON.parse(this.responseText);
      return callback(json);
    };
    downloadRequest.onerror = function() {
      var errorMessage, json;
      console.log("Error: " + this.responseText);
      json = JSON.parse(this.responseText);
      if (json.error === 'invalid_grant') {
        return login();
      } else {
        errorMessage = "Error code: " + json.status_code + ", message: " + json.error;
        return navigationDocument.replaceDocument(errorTemplate(errorMessage), navigationDocument.documents.slice(-1)[0]);
      }
    };
    return downloadRequest.send();
  };

  Downloader.prototype.downloadList = function(parentId, callback) {
    return this.download(this.urlForList(parentId), function(json) {
      var files, parentName;
      parentName = json.parent.name;
      files = json.files.map(function(f) {
        return new File(f);
      });
      return callback(parentName, files.filter(function(f) {
        return f.isUsable();
      }));
    });
  };

  Downloader.prototype.downloadMP4Status = function(fileId, callback) {
    return this.download(this.urlForMP4Status(fileId), function(json) {
      return callback(json.mp4);
    });
  };

  Downloader.prototype.convertMP4 = function(fileId) {
    return this.download(this.urlForMP4Convert(fileId), (function() {}), 'POST');
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

  function File(object) {
    var ref;
    this.id = String(object.id);
    this.constructor.files[this.id] = this;
    this.name = object.name;
    this.icon = object.icon;
    this.screenshot = object.screenshot;
    this.startFrom = object.start_from;
    this.duration = this.calculateDuration((ref = object.video_metadata) != null ? ref.duration : void 0);
    this.size = this.calculateSize(object.mp4_size || object.size);
    this.isPlayable = object.is_mp4_available || object.content_type === 'video/mp4';
    this.fileType = (function() {
      switch (object.file_type) {
        case 'FOLDER':
          return 'directory';
        case 'VIDEO':
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
    var loadingDocument, player, video;
    if (this.isPlayable) {
      video = new MediaItem('video', App.downloader.urlForMovie(this.id));
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
      return App.downloader.downloadMP4Status(this.id, (function(_this) {
        return function(response) {
          if (response.status === 'COMPLETED') {
            _this.isPlayable = true;
            navigationDocument.popDocument();
            return _this.play();
          } else {
            if (response.status === 'NOT_AVAILABLE') {
              App.downloader.convertMP4(_this.id);
            }
            return navigationDocument.replaceDocument(convertingTemplate(response.percent_done || 0), loadingDocument);
          }
        };
      })(this));
    }
  };

  File.prototype.updateStartFrom = function(time) {
    this.startFrom = time;
    return App.downloader.setStartFrom(this.id, time);
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

  File.prototype.calculateSize = function(size) {
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

  return File;

})();

var alertTemplate, convertingTemplate, errorTemplate, listItemTemplate, listTemplate, loadingTemplate, loginTemplate;

alertTemplate = function(title, description) {
  var template;
  template = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + title + "</title>\n    <description>" + description + "</description>\n  </alertTemplate>\n</document>";
  return new DOMParser().parseFromString(template, 'application/xml');
};

convertingTemplate = function(progress) {
  var description, title;
  if (progress == null) {
    progress = 0;
  }
  title = "We're converting this file to format playable on Apple TV";
  description = "This can take some time - please return later. <br />Progress: " + progress + "%";
  return alertTemplate(title, description);
};

errorTemplate = function(description) {
  return alertTemplate(escapeHTML(description), 'You can find help at https://github.com/imanel/oitup/issues');
};

listTemplate = function(title, files) {
  var list, listFooter, listHeader;
  listHeader = "<?xml version='1.0' encoding='UTF-8' ?>\n  <document>\n  <listTemplate>\n    <list>\n      <header>\n        <title>" + title + "</title>\n      </header>\n      <section>";
  listFooter = "      </section>\n    </list>\n  </listTemplate>\n</document>";
  list = files.map(function(file) {
    return listItemTemplate(file);
  });
  return new DOMParser().parseFromString(listHeader + list.join('') + listFooter, 'application/xml');
};

listItemTemplate = function(file) {
  var itemFooter, itemHeader, itemRelated, result;
  itemHeader = "<listItemLockup id='" + file.id + "'>\n  <title>" + file.name + "</title>\n  <img src=\"" + file.icon + "\" width=\"60\" height=\"60\" />";
  itemRelated = file.fileType === 'movie' ? (result = "<relatedContent>\n  <lockup>\n    <img src=\"" + file.screenshot + "\" />\n    <description>" + file.name + "<br />" + file.duration + "<br />" + file.size + "</description>\n  </lockup>\n</relatedContent>", !file.isPlayable ? result += '<decorationImage src="resource://button-more" />' : void 0, result) : "<decorationImage src=\"resource://chevron\" />\n<relatedContent>\n  <lockup>\n  </lockup>\n</relatedContent>";
  itemFooter = '</listItemLockup>';
  return itemHeader + itemRelated + itemFooter;
};

loadingTemplate = function(title) {
  var template;
  if (title == null) {
    title = 'Loading...';
  }
  template = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n  <document>\n    <loadingTemplate>\n      <activityIndicator>\n        <title>" + title + "</title>\n      </activityIndicator>\n    </loadingTemplate>\n  </document>";
  return new DOMParser().parseFromString(template, "application/xml");
};

loginTemplate = function() {
  var template;
  template = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<document>\n  <formTemplate>\n    <banner>\n      <title>Put.io Login</title>\n      <description>In order to use Put.io you will need access token.<br />To obtain one please visit https://imanel.org/oitup and follow instructions visible on screen.</description>\n    </banner>\n    <textField>Access Token</textField>\n    <footer>\n      <button>\n        <text>Login</text>\n      </button>\n    </footer>\n  </formTemplate>\n</document>";
  return new DOMParser().parseFromString(template, "application/xml");
};

var downloadList, escapeHTML, handleLogin, login, selectFile;

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

login = function() {
  var loginView, tokenField;
  loginView = loginTemplate();
  tokenField = loginView.getElementsByTagName('textField').item(0);
  loginView.addEventListener("select", function() {
    return handleLogin(tokenField);
  });
  loginView.addEventListener("play", function() {
    return handleLogin(tokenField);
  });
  return navigationDocument.pushDocument(loginView);
};

handleLogin = function(tokenField) {
  var token;
  token = tokenField.getFeature('Keyboard').text;
  localStorage.setItem('putioAccessToken', token);
  App.downloader = new Downloader(token);
  navigationDocument.clear();
  return downloadList(null);
};
