App.onLaunch = function(options) {
  var downloader;
  downloader = new Downloader(localStorage.getItem('putioAccessToken'));
  return downloader.downloadList(null, function(data) {
    var alert;
    alert = createAlert('Put.IO Data', data.map(function(d) {
      return d.fileType;
    }));
    return navigationDocument.pushDocument(alert);
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

  Downloader.prototype.download = function(url, callback) {
    var downloadRequest;
    downloadRequest = new XMLHttpRequest();
    downloadRequest.open('GET', url);
    downloadRequest.responseType = 'json';
    downloadRequest.onload = function() {
      var files;
      files = JSON.parse(this.responseText).files.map(function(f) {
        return new File(f);
      });
      console.log(files.filter(function(f) {
        return f.isUsable();
      }));
      return callback(files.filter(function(f) {
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

  return Downloader;

})();

var File;

File = (function() {
  function File(object) {
    this.id = object.id;
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

  return File;

})();

var createAlert, escapeHTML;

createAlert = function(title, description) {
  var alertString, parser;
  alertString = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + (escapeHTML(title)) + "</title>\n    <description>" + (escapeHTML(description)) + "</description>\n  </alertTemplate>\n</document>";
  parser = new DOMParser();
  return parser.parseFromString(alertString, 'application/xml');
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
