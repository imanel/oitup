import ErrorMessage from '../components/ErrorMessage'
import { login } from '../utils'

const baseURL = 'https://api.put.io/v2'

const accessToken = () => userDefaults.getData('putioAccessToken')

export const urlFor = (path) => {
  const operator = path.indexOf('?') > -1 ? '&' : '?'
  return baseURL + path + operator + 'oauth_token=' + accessToken()
};

export const download = (url, callback, method) => {
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
