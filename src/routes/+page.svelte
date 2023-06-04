<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData

  onMount(() => {
    console.log(data)
  })

</script>

<main>
  
  {#if data.success}

  <h2>King</h2>
  <ol>
    {#each data.data.male as student}
      <li>{student.fullName}</li>
    {/each}
  </ol>

  <h2>Queen</h2>
  <ol>
    {#each data.data.female as student}
      <li>{student.fullName}</li>
    {/each}
  </ol>

  {:else}

    Es ist ein Fehler aufgetreten.

  {/if}

</main>