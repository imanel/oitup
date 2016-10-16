import * as api from './api'
import ItemList from './components/ItemList'
import Loading from './components/Loading'
import Login from './components/Login'
import File from './file'

export const downloadList = (listId) => {
  const loadingDocument = Loading()
  navigationDocument.pushDocument(loadingDocument)
  api.downloadList(listId, function(header, files) {
    const list = ItemList(header, files)
    list.addEventListener("select", selectFile)
    list.addEventListener("play", selectFile)
    navigationDocument.replaceDocument(list, loadingDocument)
  })
}

const selectFile = (event) => {
  const fileId = event.target.getAttribute('id')
  const file = File.files[fileId]
  switch (file.fileType) {
    case 'movie':
      file.play()
      break
    case 'directory':
      downloadList(file.id)
      break
  }
}

export const escapeHTML = (string) => {
  return String(string).replace(/[\"&<>]/g, (chr) => {
    return {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    }[chr]
  })
}

export const login = () => {
  const loginView = Login()
  const tokenField = loginView.getElementsByTagName('textField').item(0)
  loginView.addEventListener("select", () => handleLogin(tokenField))
  loginView.addEventListener("play", () => handleLogin(tokenField))
  navigationDocument.pushDocument(loginView)
}

export const handleLogin = (tokenField) => {
  const token = tokenField.getFeature('Keyboard').text
  userDefaults.setData('putioAccessToken', token)
  navigationDocument.clear()
  downloadList(null)
}
