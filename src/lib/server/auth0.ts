import pkg from "auth0";

const auth0 = new pkg.AuthenticationClient({
  domain: "simplifieduser.eu.auth0.com",
  clientId: "LlKXTOza5PVGlWoe2EVqrmv207WwTZTp",
})

export default auth0