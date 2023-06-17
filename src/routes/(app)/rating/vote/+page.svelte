<script lang="ts">
  import { deserialize } from "$app/forms";
  import type { FemaleStudent, MaleStudent } from "@prisma/client";
  import type { PageData } from "./$types";
  import type { RatingVoteFemaleSearch, RatingVoteMaleSearch, RatingVoteSubmit, ServerResponse } from "$lib/types";
  
  export let data: PageData
  export let form: Awaited<ServerResponse<RatingVoteSubmit>>

  let formElement: HTMLFormElement
  let inputMale: string
  let inputFemale: string

  let showSubmit = false

  let maleResults: MaleStudent[] = []
  let femaleResults: FemaleStudent[] = []

  let selectedMale = -1
  let selectedFemale = -1

  async function maleSearch() {

    showSubmit = false

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

    showSubmit = false

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
    maleResults = [student]
    if (selectedFemale) showSubmit = true
  }

  async function selectFemale(student: MaleStudent) {
    selectedFemale = student.id
    inputFemale = student.fullName
    femaleResults = [student]
    if (selectedMale) showSubmit = true
  }

</script>

<main>

  {#if form}

  <div class="wrapper">

    {#if form.success}

    <div class="message is-success">
      <div class="message-header">
        Vielen Dank!
      </div>
      <div class="message-body">
        Du hast erfolgreich abgestimmt.<br>Vielen Dank für deinen Beitrag.
      </div>
    </div>

    {:else}
      
    <div class="message is-danger">
      <div class="message-header">
        Fehler!
      </div>
      <div class="message-body">
        Es ist ein unbekannter Fehler aufgetreten.<br>Bitte versuche es zu einem späteren Zeitpunkt nochmal.
      </div>
    </div>

    {/if}

  </div>


  {:else if data.success}

    <form bind:this={formElement} method="post" action="?/submit">

      <div class="cards">
        <div class="card">
          <input bind:value={inputMale} on:input={ maleSearch } id="m" name="m" type="text" placeholder="King">
            <div class="results">
              {#each maleResults as student}
                <button on:click|preventDefault={ () => selectMale(student) } class="result">
                  {@html student.fullName}
                </button>
              {/each}
            </div>
        </div>
        <div class="card">
          <input bind:value={inputFemale} on:input={ femaleSearch } id="f" name="f" type="text" placeholder="Queen">
          <div class="results">
            {#each femaleResults as student}
                <button on:click|preventDefault={ () => selectFemale(student) } class="result">
                  {@html student.fullName}
                </button>
            {/each}
          </div>
        </div>
      </div>

      <input bind:value={selectedMale} type="text" id="m-id" name="m-id" class="hidden">
      <input bind:value={selectedFemale} type="text" id="f-id" name="f-id" class="hidden">

      {#if showSubmit}
        <button>Absenden</button>
      {/if}

    </form>

  {:else}

    <div class="wrapper">

    {#if data.error.reason === "forbidden"}
      
    <div class="message is-success">
      <div class="message-header">
        Vielen Dank!
      </div>
      <div class="message-body">
        Du hast bereits abgestimmt.<br>Vielen Dank für deinen Beitrag.
      </div>
    </div>

    {:else if data.error.reason === "unauthorized"}

    <div class="message is-warning">
      <div class="message-header">
        Achtung!
      </div>
      <div class="message-body">
        Um selber abstimmen zu können, musst du dich erst einloggen.
      </div>
    </div>

    {:else}

    <div class="message is-danger">
      <div class="message-header">
        Fehler!
      </div>
      <div class="message-body">
        Es ist ein unbekannter Fehler aufgetreten.<br>Bitte versuche es zu einem späteren Zeitpunkt nochmal.
      </div>
    </div>

    {/if}

  </div>

  {/if}


  

</main>

<style>

  .cards {

    display: flex;
    gap: 50px;
    margin-bottom: 50px;

  }

  .results {
    margin-top: 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .hidden {
    display: none;
  }

  .wrapper {
    margin-top: 50px;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>