export const alertTemplate = (title, description) => {
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <alertTemplate>
        <title>${title}</title>
        <description>${description}</description>
      </alertTemplate>
    </document>"
  `
  return new DOMParser().parseFromString(template, 'application/xml')
}

export const convertingTemplate = (progress = 0) => {
  const title = "We're converting this file to format playable on Apple TV"
  const description = `This can take some time - please return later. <br />Progress: ${progress}%`
  return alertTemplate(title, description)
}

export const errorTemplate = (title) => {
  const description = 'You can find help at https://github.com/imanel/oitup/issues'
  return alertTemplate(escapeHTML(title), description)
}

export const listTemplate = (title, files) => {
  let listBody
  if (files.length > 0) {
    listBody = files.map(file => listItemTemplate(file)).join('')
  } else {
    listBody = emptyListItemTemplate()
  }
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <head>
        <style>
          .description {
            tv-text-style: none;
            tv-text-max-lines: 7;
            font-size: 40;
            color: rgba(100, 100, 100);
          }
        </style>
      </head>
      <listTemplate>
        <list>
          <header>
            <title>${title}</title>
          </header>
          <section>
            ${listBody}
          </section>
        </list>
      </listTemplate>
    </document>
  `

  return new DOMParser().parseFromString(template, 'application/xml')
}

const listItemTemplate = (file) => {
  let decorationImage = ""
  if (file.fileType !== 'movie') {
    decorationImage = '<decorationImage src="resource://chevron" />'
  } else if (!file.isPlayable) {
    decorationImage = '<decorationImage src="resource://button-more" />'
  }

  return (`
    <listItemLockup id='${file.id}'>
      <title>${file.name}</title>
      <img src='${file.icon}' width='60' height='60' />
      ${decorationImage}
      <relatedContent>
        <lockup>
          <img src='${file.screenshot}' />
          <description class='description'>${file.name}
            ${(file.fileType === 'movie') ? "<br /><br />File Size: " + file.size : ""}
          </description>
        </lockup>
      </relatedContent>
    </listItemLockup>
  `)
}

const emptyListItemTemplate = () => {
  return (`
    <listItemLockup>
      <title>Folder is empty</title>
    </listItemLockup>
  `)
}

export const loadingTemplate = (title = 'Loading...') => {
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <loadingTemplate>
        <activityIndicator>
          <title>${title}</title>
        </activityIndicator>
      </loadingTemplate>
    </document>
  `
  return new DOMParser().parseFromString(template, "application/xml")
}

export const loginTemplate = () => {
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <formTemplate>
        <banner>
          <title>Put.io Login</title>
          <description>
            In order to use Put.io you will need access token.
            <br />
            To obtain one please visit https://imanel.org/oitup and follow instructions visible on screen.
          </description>
        </banner>
        <textField>Access Token</textField>
        <footer>
          <button>
            <text>Login</text>
          </button>
        </footer>
      </formTemplate>
    </document>
  `
  return new DOMParser().parseFromString(template, "application/xml")
}
