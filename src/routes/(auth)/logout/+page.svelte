<script lang="ts">
    import { page } from "$app/stores";
  import { WebAuth } from "auth0-js";
  import { onMount } from "svelte";
  import "$lib/app.scss"

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

<svelte:head>
  <title>RateYourEVI | Logout...</title>
</svelte:head>

<main>
  <div class="wrapper">
    <div class="content">
      <div class="title">Weiterleitung...</div>
      <div class="subtitle">Bitte warten!</div>
    </div>
  </div>
</main>

<style>
  .wrapper {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>