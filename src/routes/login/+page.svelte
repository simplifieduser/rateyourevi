<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import type { ActionData } from "./$types";

  export let form: ActionData
  let redirect = $page.url.searchParams.get("r") || ""

  onMount(() => {
    if (form && form.success) {
      goto(form.data.redirect)
    }
  })

</script>

<main>

  <form method="post">
    <input id="c" name="c" type="text" placeholder="Zugangscode">
    <input bind:value={redirect} id="r" class="hidden" name="r" type="text">
    <button>Weiter</button>
  </form>

  {#if form && !form.success}

    {#if form.error.reason === "unauthorized"}
      Der eingegebene Zugangscode ist ungültig! Bitte versuche es erneut.

    {:else if form.error.reason === "missing"}
      Bitte gebe deinen Zugangscode ein.

    {/if}

  {/if}


</main>

<style>
  .hidden {
    display: none;
  }
</style>