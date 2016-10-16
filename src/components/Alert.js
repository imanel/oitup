const Alert = (title, description) => {
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

export default Alert
