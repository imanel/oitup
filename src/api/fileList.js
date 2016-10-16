import { download, urlFor } from './util'
import File from '../file'

const urlForList = (parentId) => {
  let path = '/files/list'
  if (parentId) {
    path += '?parent_id=' + parentId
  }
  return urlFor(path)
};

export const downloadList = (parentId, callback) => {
  return download(urlForList(parentId), (json) => {
    const parentName = json.parent.name;
    const files = json.files.map(f => new File(f)).filter(f => f.isUsable())
    return callback(parentName, files)
  })
}
