<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { StudentQueryType } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData

  let currentMode: StudentQueryType = "all"
  let currentPage = 0
  let showDropdown = false

  function loadNext() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage) || currentPage < 0) currentPage = 0
    currentPage += 1
    goto("?p=" + currentPage + "&q=" + currentMode)

  }

  function loadPrevious() {
    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage) || currentPage < 1) currentPage = 1
    currentPage -= 1

    goto("?p=" + currentPage + "&q=" + currentMode)
  }

  function toggleDropdown() {

    showDropdown = showDropdown ? false : true

  }

  function setMaleQuery() {
    currentMode = "maleOnly"
    currentPage = 0
    showDropdown = false
    goto("?q=" + currentMode)
  }

  function setFemaleQuery() {
    currentMode = "femaleOnly"
    currentPage = 0
    showDropdown = false
    goto("?q=" + currentMode)
  }

  function setAllQuery() {
    currentMode = "all"
    currentPage = 0
    showDropdown = false
    goto("?q=" + currentMode)
  }

</script>

<svelte:head>
  <title>RateYourEVI | Schüler Rating</title>
</svelte:head>

<main>

  <div class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title">
          Schüler Rating
        </p>
        <p class="subtitle">
          Abitur 2023
        </p>
      </div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <h1 class="title is-4">Liste aller Schüler</h1>
      <h2 class="subtitle is-5">Lorem ipsum dolor sit amet</h2>
      <div class="level">
        <a href="/rating/vote" class="button is-primary">Abstimmen</a>
        <div class={ showDropdown ? "dropdown is-right is-active" : "dropdown is-right" }>
          <div class="dropdown-trigger">
            <button on:click|preventDefault={toggleDropdown} class="button">
              <span>Filter</span>
            </button>
          </div>
          {#if showDropdown}
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a href="#top" on:click={setAllQuery} class="dropdown-item">Alle</a>
                <a href="#top" on:click={setMaleQuery} class="dropdown-item">King</a>
                <a href="#top" on:click={setFemaleQuery} class="dropdown-item">Queen</a>
              </div>
            </div>
          {/if}
        </div>
      </div>
      </div>
  </section>
  
  <div class="container">
    {#if data.success}
    <div class="table-container">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Votes</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {#each data.data.students as student}
            <tr>
              <td>{data.data.students.indexOf(student) + currentPage * 20 + 1}.</td>
              <td>{student.totalVotes}</td>
              <th>{@html student.fullName}</th>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="level">
      <div class="level-item">
        <div class="buttons">
          <button on:click={loadPrevious} class="button">
            <span class="icon is-small">
              <img alt="Weiter" src="/chevron-left.svg" width="12px">
            </span>
          </button>
          <button on:click={loadNext} class="button">
            <span class="icon is-small">
              <img alt="Zurück" src="/chevron-right.svg" width="12px">
            </span>
          </button>
        </div>
      </div>
    </div>
  {:else}
    <article class="message">
      <div class="message-header">
        <p>Fehler</p>
      </div>
      <div class="message-body">
        Es ist ein unerwarteter Fehler beim Laden aufgetreten. Bitte versuche es später nochmal.
      </div>
    </article>
  {/if}
  </div>
</main>