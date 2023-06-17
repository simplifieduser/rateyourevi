<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";

  onMount(() => {

    const client = new WebAuth({
      domain: "simplifieduser.eu.auth0.com",
      clientID: "LlKXTOza5PVGlWoe2EVqrmv207WwTZTp",
    })

    client.parseHash((error, result) => {

      const redirectUrl = $page.url.searchParams.get("redirect") || "/"
      const currentUrl = $page.url.origin + "/login/"

      if (document.cookie.includes("token")) {
        goto(redirectUrl)
        return
      }
      

      if (error || !result) {
        client.authorize({
          connection: "google-oauth2",
          redirectUri: currentUrl,
          responseType: "token",
          appState: redirectUrl
        })
        return
      }

      document.cookie = `token=${result.accessToken}; expires=${result.expiresIn}; path="/"`

      if (typeof result.appState === "string") goto(result.appState)
      else goto("/")

    })

  })

</script>

<main>
  Redirecting...
</main>