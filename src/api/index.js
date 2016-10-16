import * as fromFile from './file'
import * as fromFileList from './fileList'

export const urlForMovie = (fileId) => fromFile.urlForMovie(fileId)
export const downloadMP4Status = (fileId, callback) => fromFile.downloadMP4Status(fileId, callback)
export const convertMP4 = (fileId) => fromFile.convertMP4(fileId)
export const setStartFrom = (fileId, time) => fromFile.setStartFrom(fileId, time)

export const downloadList = (parentId, callback) => fromFileList.downloadList(parentId, callback)
