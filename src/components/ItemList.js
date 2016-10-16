import Item from './Item'

const ItemList = (title, files) => {
  let listBody
  if (files.length > 0) {
    listBody = files.map(file => Item(file)).join('')
  } else {
    listBody = `
      <listItemLockup>
        <title>Folder is empty</title>
      </listItemLockup>
    `
  }
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <head>
        <style>
          .description {
            tv-text-style: none;
            tv-text-max-lines: 7;
            font-size: 40;
            color: rgba(100, 100, 100, 1);
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

export default ItemList
