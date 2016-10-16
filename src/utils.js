import * as api from './api'
import ItemList from './components/ItemList'
import Loading from './components/Loading'
import Login from './components/Login'
import File from './file'

export const downloadList = function(listId) {
  var loadingDocument;
  loadingDocument = Loading();
  navigationDocument.pushDocument(loadingDocument);
  return api.downloadList(listId, function(header, files) {
    var list;
    list = ItemList(header, files);
    list.addEventListener("select", selectFile);
    list.addEventListener("play", selectFile);
    if (loadingDocument) {
      return navigationDocument.replaceDocument(list, loadingDocument);
    } else {
      return navigationDocument.pushDocument(list);
    }
  });
};

export const selectFile = function(event) {
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

export const escapeHTML = function(string) {
  return String(string).replace(/[\"&<>]/g, function(chr) {
    return {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }[chr];
  });
};

export const login = function() {
  var loginView, tokenField;
  loginView = Login();
  tokenField = loginView.getElementsByTagName('textField').item(0);
  loginView.addEventListener("select", function() {
    return handleLogin(tokenField);
  });
  loginView.addEventListener("play", function() {
    return handleLogin(tokenField);
  });
  return navigationDocument.pushDocument(loginView);
};

export const handleLogin = function(tokenField) {
  var token;
  token = tokenField.getFeature('Keyboard').text;
  userDefaults.setData('putioAccessToken', token);
  navigationDocument.clear();
  return downloadList(null);
};
