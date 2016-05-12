App.onLaunch = function(options) {
  var downloader;
  downloader = new Downloader(localStorage.getItem('putioAccessToken'));
  return downloader.downloadList(null, function(data) {
    var alert;
    alert = createAlert('Put.IO Data', data);
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
      files = JSON.parse(this.responseText).files;
      return callback(files);
    };
    return downloadRequest.send();
  };

  Downloader.prototype.downloadList = function(parentId, callback) {
    return this.download(this.urlForList(parentId), callback);
  };

  return Downloader;

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
