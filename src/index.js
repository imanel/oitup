import { downloadList } from './utils'

App.onLaunch = function(options) {
  this.location = options.location.substring(0, options.location.indexOf('application.js'));
  downloadList(null);
};

App.onWillEnterForeground = function() {
  if (navigationDocument.documents.length === 1) {
    navigationDocument.clear();
    downloadList(null);
  }
};
