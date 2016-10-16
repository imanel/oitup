import Alert from './Alert'
import { escapeHTML } from '../utils'

const ErrorMessage = (title) => {
  const description = 'You can find help at https://github.com/imanel/oitup/issues'
  return Alert(escapeHTML(title), description)
}

export default ErrorMessage
