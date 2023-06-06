<script lang="ts">
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";

  onMount(() => {
    const webAuth = new WebAuth({
        domain: "simplifieduser.eu.auth0.com",
        clientID: "2cOKd4LLb1P13vnU9P1omiTHvBkSyEFE",
        responseType: "token",
        redirectUri: "https://localhost:5173/",
    })

    webAuth.authorize()
  })

</script>

<main>

</main>