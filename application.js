App.onLaunch = function(options) {
    var alert = createAlert("Hello World!", "Welcome to tvOS");
    navigationDocument.pushDocument(alert);
};

App.onWillResignActive = function() {};

App.onDidEnterBackground = function() {};

App.onWillEnterForeground = function() {};

App.onDidBecomeActive = function() {};

App.onWillTerminate = function() {};

var createAlert = function(title, description) {
    var alertString = "<?xml version='1.0' encoding='UTF-8' ?>" + "<document>" + "<alertTemplate>" + "<title>" + title + "</title>" + "<description>" + description + "</description>" + "</alertTemplate>" + "</document>";
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc;
};