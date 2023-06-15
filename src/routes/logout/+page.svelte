<script lang="ts">
    import { page } from "$app/stores";
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";

  onMount(() => {

    const client = new WebAuth({
      domain: "simplifieduser.eu.auth0.com",
      clientID: "LlKXTOza5PVGlWoe2EVqrmv207WwTZTp",
    })

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    const currentUrl = $page.url.origin + "/"

    client.logout({
      returnTo: currentUrl,
    })

  })

</script>

<main>
  Redirecting...
</main>