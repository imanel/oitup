const Loading = (title = 'Loading...') => {
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

export default Loading
