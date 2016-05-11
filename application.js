var createAlert;

App.onLaunch = function(options) {
  var alert;
  alert = createAlert('Hello World!', 'Welcome to tvOS');
  return navigationDocument.pushDocument(alert);
};

App.onWillResignActive = function() {};

App.onDidEnterBackground = function() {};

App.onWillEnterForeground = function() {};

App.onDidBecomeActive = function() {};

App.onWillTerminate = function() {};

createAlert = function(title, description) {
  var alertString, parser;
  alertString = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + title + "</title>\n    <description>" + description + "</description>\n  </alertTemplate>\n</document>";
  parser = new DOMParser();
  return parser.parseFromString(alertString, 'application/xml');
};
