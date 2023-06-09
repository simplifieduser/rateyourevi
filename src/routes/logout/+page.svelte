<script lang="ts">
  import { page } from "$app/stores";
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";deprecated

  onMount(() => {

    const client = new WebAuth({
      domain: "simplifieduser.eu.auth0.com",
      clientID: "LlKXTOza5PVGlWoe2EVqrmv207WwTZTp",
    })

    const redirectUrl = $page.url.searchParams.get("r") || "/"
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    client.logout({
      returnTo: redirectUrl
    })

  })

</script>

<main>
  Redirecting...
</main>