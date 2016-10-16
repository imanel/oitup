export const alertTemplate = function(title, description) {
  var template;
  template = "<?xml version='1.0' encoding='UTF-8' ?>\n<document>\n  <alertTemplate>\n    <title>" + title + "</title>\n    <description>" + description + "</description>\n  </alertTemplate>\n</document>";
  return new DOMParser().parseFromString(template, 'application/xml');
};

export const convertingTemplate = function(progress) {
  var description, title;
  if (progress == null) {
    progress = 0;
  }
  title = "We're converting this file to format playable on Apple TV";
  description = "This can take some time - please return later. <br />Progress: " + progress + "%";
  return alertTemplate(title, description);
};

export const errorTemplate = function(description) {
  return alertTemplate(escapeHTML(description), 'You can find help at https://github.com/imanel/oitup/issues');
};

export const listTemplate = function(title, files) {
  var list, listFooter, listHeader;
  listHeader = "<?xml version='1.0' encoding='UTF-8' ?>\n  <document>\n  <head>\n    <style>\n      .description {\n        tv-text-style: none;\n        tv-text-max-lines: 7;\n        font-size: 40;\n        color: rgba(100, 100, 100);\n      }\n    </style>\n  </head>\n  <listTemplate>\n    <list>\n      <header>\n        <title>" + title + "</title>\n      </header>\n      <section>";
  listFooter = "      </section>\n    </list>\n  </listTemplate>\n</document>";
  list = files.length > 0 ? files.map(function(file) {
    return listItemTemplate(file);
  }) : [emptyListItemTemplate()];
  return new DOMParser().parseFromString(listHeader + list.join('') + listFooter, 'application/xml');
};

export const listItemTemplate = function(file) {
  var itemFooter, itemHeader, itemRelated, result;
  itemHeader = "<listItemLockup id='" + file.id + "'>\n  <title>" + file.name + "</title>\n  <img src=\"" + file.icon + "\" width=\"60\" height=\"60\" />";
  itemRelated = file.fileType === 'movie' ? (result = "<relatedContent>\n  <lockup>\n    <img src=\"" + file.screenshot + "\" />\n    <description class=\"description\">" + file.name + "<br /><br />File Size: " + file.size + "</description>\n  </lockup>\n</relatedContent>", !file.isPlayable ? result += '<decorationImage src="resource://button-more" />' : void 0, result) : "<decorationImage src=\"resource://chevron\" />\n<relatedContent>\n  <lockup>\n    <img src=\"" + file.screenshot + "\" />\n    <description class=\"description\">" + file.name + "</description>\n  </lockup>\n</relatedContent>";
  itemFooter = '</listItemLockup>';
  return itemHeader + itemRelated + itemFooter;
};

export const emptyListItemTemplate = function() {
  return "<listItemLockup>\n  <title>Folder is empty</title>\n</listItemLockup>";
};

export const loadingTemplate = function(title) {
  var template;
  if (title == null) {
    title = 'Loading...';
  }
  template = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n  <document>\n    <loadingTemplate>\n      <activityIndicator>\n        <title>" + title + "</title>\n      </activityIndicator>\n    </loadingTemplate>\n  </document>";
  return new DOMParser().parseFromString(template, "application/xml");
};

export const loginTemplate = function() {
  var template;
  template = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<document>\n  <formTemplate>\n    <banner>\n      <title>Put.io Login</title>\n      <description>In order to use Put.io you will need access token.<br />To obtain one please visit https://imanel.org/oitup and follow instructions visible on screen.</description>\n    </banner>\n    <textField>Access Token</textField>\n    <footer>\n      <button>\n        <text>Login</text>\n      </button>\n    </footer>\n  </formTemplate>\n</document>";
  return new DOMParser().parseFromString(template, "application/xml");
};
