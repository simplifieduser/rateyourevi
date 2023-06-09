<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { StudentQueryType } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData

  let currentMode: StudentQueryType = "all"

  function loadMore() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    let currentPage = parseInt(currentPageString)
    if (!Number.isNaN(currentPage)) currentPage = 0

    goto("?p=" + (currentPage + 1) + "&q=" + currentMode)

  }

  function setMaleQuery() {
    currentMode = "maleOnly"
    goto("?q=" + currentMode)
  }

  function setFemaleQuery() {
    currentMode = "femaleOnly"
    goto("?q=" + currentMode)
  }

  function setAllQuery() {
    currentMode = "all"
    goto("?q=" + currentMode)
  }

</script>

<main>

  <button on:click={setAllQuery}>Alle</button>
  <button on:click={setFemaleQuery}>Queen</button>
  <button on:click={setMaleQuery}>King</button>

  {#if data.success}
    <ol>
      {#each data.data.students as student}
        <li>{student.fullName}</li>
      {/each}
    </ol>

  {:else}
    Es ist ein Fehler aufgetreten!
  {/if}

  <button on:click={loadMore} >Mehr Laden</button>

</main>