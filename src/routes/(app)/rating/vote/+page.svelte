<script lang="ts">
  import { deserialize } from "$app/forms";
  import type { FemaleStudent, MaleStudent } from "@prisma/client";
  import type { PageData } from "./$types";
  import type { RatingVoteFemaleSearch, RatingVoteMaleSearch, RatingVoteSubmit, ServerResponse } from "$lib/types";
    import Error from "../../../+error.svelte";
  
  export let data: PageData
  export let form: Awaited<ServerResponse<RatingVoteSubmit>>

  let formElement: HTMLFormElement
  let inputMale: string
  let inputFemale: string

  let disableSubmit = true

  let maleResults: MaleStudent[] = []
  let femaleResults: FemaleStudent[] = []

  let selectedMale = -1
  let selectedFemale = -1

  async function maleSearch() {

    disableSubmit = true

    const formData = new FormData(formElement)
    const query = formData.get("m")
    if (!query || query.length < 3) {
      maleResults = []
      return
    }

    const response = await fetch("?/maleSearch", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<RatingVoteMaleSearch>>

    if (result.success) {
      maleResults = result.data.results
    }
    else {
      femaleResults = []
    }

  }
  
  async function femaleSearch() {

    disableSubmit = true

    const formData = new FormData(formElement)
    const query = formData.get("f")
    if (!query || query.length < 3) {
      femaleResults = []
      return
    }

    const response = await fetch("?/femaleSearch", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<RatingVoteFemaleSearch>>

    if (result.success) {
      femaleResults = result.data.results
    }
    else {
      femaleResults = []
    }
  
  }

  async function selectMale(student: MaleStudent) {
    selectedMale = student.id
    inputMale = student.fullName
    maleResults = []
    if (selectedFemale !== -1) disableSubmit = false
  }

  async function selectFemale(student: MaleStudent) {
    selectedFemale = student.id
    inputFemale = student.fullName
    femaleResults = []
    if (selectedMale !== -1) disableSubmit = false
  }

</script>

<svelte:head>
  <title>RateYourEVI | Abstimmen</title>
</svelte:head>

<main>
    <section class="section">
      <div class="container">
        <h1 class="title">Abstimmen</h1>
        <h2 class="subtitle">Stimmt darüber ab, wer König und Königen wird.</h2>
        {#if data.success}
          <button on:click={ () => formElement.submit() } disabled={disableSubmit} class="button is-primary">Absenden</button>
        {/if}
      </div>
    </section>

    <div class="container">

    {#if form}
      {#if form.success}
  
      <div class="message">
        <div class="message-header">
          Vielen Dank!
        </div>
        <div class="message-body">
          Du hast erfolgreich abgestimmt.<br>Vielen Dank für deinen Beitrag.
        </div>
      </div>
  
      {:else}

      {#if form.error.reason === "forbidden" && form.error.details === "voting closed"}

      <div class="message">
        <div class="message-header">
          Vielen Dank!
        </div>
        <div class="message-body">
          Das Voting wurde geschlossen und es werden keine weiteren Stimmen mehr aufgenommen.
          <br>Vielen Dank für deinen Beitrag.
        </div>
      </div>

      {:else}

        <div class="message">
          <div class="message-header">
            Fehler!
          </div>
          <div class="message-body">
            Es ist ein unbekannter Fehler aufgetreten.<br>Bitte versuche es zu einem späteren Zeitpunkt nochmal.
          </div>
        </div>
      
      {/if}
  
      {/if}
  
    {:else if data.success}
  
      <form bind:this={formElement} method="post" action="?/submit">
        <div class="columns">
          <div class="column">
            <div class="panel">
              <p class="panel-heading">König</p>
              <div class="panel-block">
                <div class="control">
                  <input bind:value={inputMale} on:input={ maleSearch } id="m" name="m" type="text" class="input" placeholder="Name" autocapitalize="words" autocomplete="off" autocorrect="off">
                </div>
              </div>
              {#each maleResults as student}
              <div class="panel-block">
                <a href="#top" on:click|preventDefault={ () => selectMale(student) }>
                  {@html student.fullName}
                </a>
              </div>
              {/each}
            </div>
          </div>
          <div class="column">
            <div class="panel">
              <p class="panel-heading">Königin</p>
              <div class="panel-block">
                <div class="control">
                  <input bind:value={inputFemale} on:input={ femaleSearch } id="f" name="f" type="text" class="input" placeholder="Name" autocapitalize="words" autocomplete="off" autocorrect="off">
                </div>
              </div>
              {#each femaleResults as student}
              <div class="panel-block">
                <a href="#top" on:click|preventDefault={ () => selectFemale(student) }>
                  {@html student.fullName}
                </a>
              </div>
              {/each}
          </div>
        </div>
  
        <input bind:value={selectedMale} type="text" id="m-id" name="m-id" class="hidden">
        <input bind:value={selectedFemale} type="text" id="f-id" name="f-id" class="hidden">
  
      </form>
  
    {:else}
  
      {#if data.error.reason === "forbidden"}

        {#if data.error.details === "already voted"}
          <div class="message">
            <div class="message-header">
              Vielen Dank!
            </div>
            <div class="message-body">
              Du hast bereits abgestimmt.<br>Vielen Dank für deinen Beitrag.
            </div>
          </div>
        {:else}
          <div class="message">
            <div class="message-header">
              Vielen Dank!
            </div>
            <div class="message-body">
              Das Voting wurde geschlossen und es werden keine weiteren Stimmen mehr aufgenommen.
              <br>Vielen Dank für deinen Beitrag.
            </div>
          </div>
        {/if}
        
  
      {:else if data.error.reason === "unauthorized"}
  
      <div class="message">
        <div class="message-header">
          Achtung!
        </div>
        <div class="message-body">
          Um selber abstimmen zu können, musst du dich erst einloggen.
        </div>
      </div>
  
      {:else}
  
      <div class="message">
        <div class="message-header">
          Fehler!
        </div>
        <div class="message-body">
          Es ist ein unbekannter Fehler aufgetreten.<br>Bitte versuche es zu einem späteren Zeitpunkt nochmal.
        </div>
      </div>
  
      {/if}
  
    {/if}
  </div>

</main>

<style>

  .panel-block {
    background-color: #0e1111;
  }

  .panel-block a {
    color: #fbfefe;
  }

  .panel-block a:hover {
    color: #acacac;
  }

  .input {
    background-color: #0e1111;
  }

  .hidden {
    display: none;
  }

</style>