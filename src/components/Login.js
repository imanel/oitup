const Login = () => {
  const template = `<?xml version='1.0' encoding='UTF-8' ?>
    <document>
      <formTemplate>
        <banner>
          <title>Put.io Login</title>
          <description>
            In order to use Put.io you will need access token.
            <br />
            To obtain one please visit https://imanel.org/oitup and follow instructions visible on screen.
          </description>
        </banner>
        <textField>Access Token</textField>
        <footer>
          <button>
            <text>Login</text>
          </button>
        </footer>
      </formTemplate>
    </document>
  `
  return new DOMParser().parseFromString(template, "application/xml")
}

export default Login
