<script lang="ts">
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";

  onMount(() => {

    const client = new WebAuth({
      domain: "simplifieduser.eu.auth0.com",
      clientID: "LlKXTOza5PVGlWoe2EVqrmv207WwTZTp",
    })

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    client.logout({
      returnTo: `http://localhost:5173/`,
    })

  })

</script>

<main>
  Redirecting...
</main>