import Alert from './Alert'

const ErrorMessage = (title) => {
  const description = 'You can find help at https://github.com/imanel/oitup/issues'
  return Alert(escapeHTML(title), description)
}

export default ErrorMessage
