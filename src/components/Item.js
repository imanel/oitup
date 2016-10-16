const Item = (file) => {
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

export default Item
