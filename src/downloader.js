import ErrorMessage from './components/ErrorMessage'
import File from './file'
import { login } from './utils'

const baseURL = 'https://api.put.io/v2'

const accessToken = () => {
  return userDefaults.getData('putioAccessToken')
}

const urlFor = (path) => {
  var operator;
  operator = path.indexOf('?') > -1 ? '&' : '?';
  return baseURL + path + operator + 'oauth_token=' + accessToken();
};

const urlForList = (parentId) => {
  var path;
  path = '/files/list';
  if (parentId) {
    path += '?parent_id=' + parentId;
  }
  return urlFor(path);
};

const urlForMovie = (fileId) => {
  return urlFor('/files/' + fileId + '/hls/media.m3u8?subtitle_key=all');
};

const urlForSetStartFrom = (fileId) => {
  return urlFor('/files/' + fileId + '/start-from/set');
};

const urlForMP4Status = (fileId) => {
  return urlFor('/files/' + fileId + '/mp4');
};

const urlForMP4Convert = (fileId) => {
  return urlForMP4Status(fileId);
};

const download = (url, callback, method) => {
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
      return navigationDocument.replaceDocument(ErrorMessage(errorMessage), navigationDocument.documents.slice(-1)[0]);
    }
  };
  return downloadRequest.send();
};

const downloadList = (parentId, callback) => {
  return download(urlForList(parentId), function(json) {
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

const downloadMP4Status = (fileId, callback) => {
  return download(urlForMP4Status(fileId), function(json) {
    return callback(json.mp4);
  });
};

const convertMP4 = (fileId) => {
  return download(urlForMP4Convert(fileId), (function() {}), 'POST');
};

const setStartFrom = (fileId, time) => {
  var request, url;
  url = urlForSetStartFrom(fileId);
  request = new XMLHttpRequest();
  request.open('POST', url);
  request.responseType = 'json';
  return request.send('time=' + time);
};

export default {
  urlForMovie,
  downloadList,
  downloadMP4Status,
  convertMP4,
  setStartFrom,
}
