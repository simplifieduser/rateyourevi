<script lang="ts">
  import { page } from "$app/stores";
  import "$lib/app.scss"
</script>

<svelte:head>
  <title>Fehler - {$page.status}</title>
</svelte:head>

<main>
  <div class="wrapper">
    <div class="content">
      <div class="title">
        {$page.status}
        {#if $page.error}
         - {$page.error.message}
         {/if}
      </div>
      <div class="subtitle">Ein unerwarteter Fehler ist aufgetreten.<br>Bitte versuche es später nochmal und kehre vorerst zur Startseite zurück.</div>
      <a href="/" class="button is-primary" >Zurück</a>
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