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

      const redirectUrl = $page.url.searchParams.get("r") || "/"

      if (document.cookie.includes("token")) {
        goto(redirectUrl)
        return
      }

      if (error || !result) {
        client.authorize({ 
          redirectUri: `http://localhost:5173/login/r=${redirectUrl}`,
          responseType: "token" 
        })
        return
      }

      document.cookie = `token=${result.accessToken}; expires=${result.expiresIn}; path="/"`

      goto(redirectUrl)  

    })

  })

</script>

<main>
  Redirecting...
</main>