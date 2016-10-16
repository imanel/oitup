import Alert from './Alert'

const Converting = (progress = 0) => {
  const title = "We're converting this file to format playable on Apple TV"
  const description = `This can take some time - please return later. <br />Progress: ${progress}%`
  return Alert(title, description)
}

export default Converting
