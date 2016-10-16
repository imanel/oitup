import Downloader from './downloader'
import { downloadList } from './utils'

App.onLaunch = function(options) {
  this.location = options.location;
  this.location = this.location.substring(0, this.location.indexOf('application.js'));
  return downloadList(null);
};

App.onWillEnterForeground = function() {
  if (navigationDocument.documents.length === 1) {
    navigationDocument.clear();
    return downloadList(null);
  }
};
