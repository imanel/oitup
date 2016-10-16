import File from './file'
import { errorTemplate } from './templates'
import { login } from './utils'

class Downloader {
  get baseURL() {
     return 'https://api.put.io/v2'
  }

  get accessToken() {
    return userDefaults.getItem('putioAccessToken')
  }

  urlFor(path) {
    var operator;
    operator = path.indexOf('?') > -1 ? '&' : '?';
    return this.baseURL + path + operator + 'oauth_token=' + this.accessToken;
  };

  urlForList(parentId) {
    var path;
    path = '/files/list';
    if (parentId) {
      path += '?parent_id=' + parentId;
    }
    return this.urlFor(path);
  };

  urlForMovie(fileId) {
    return this.urlFor('/files/' + fileId + '/hls/media.m3u8?subtitle_key=all');
  };

  urlForSetStartFrom(fileId) {
    return this.urlFor('/files/' + fileId + '/start-from/set');
  };

  urlForMP4Status(fileId) {
    return this.urlFor('/files/' + fileId + '/mp4');
  };

  urlForMP4Convert(fileId) {
    return this.urlForMP4Status(fileId);
  };

  download(url, callback, method) {
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

  downloadList(parentId, callback) {
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

  downloadMP4Status(fileId, callback) {
    return this.download(this.urlForMP4Status(fileId), function(json) {
      return callback(json.mp4);
    });
  };

  convertMP4(fileId) {
    return this.download(this.urlForMP4Convert(fileId), (function() {}), 'POST');
  };

  setStartFrom(fileId, time) {
    var request, url;
    url = this.urlForSetStartFrom(fileId);
    request = new XMLHttpRequest();
    request.open('POST', url);
    request.responseType = 'json';
    return request.send('time=' + time);
  };
}

export default Downloader
