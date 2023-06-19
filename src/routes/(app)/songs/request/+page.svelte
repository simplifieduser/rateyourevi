<script lang="ts">
    import type { ServerResponse, SongsVoteSearch, SongsVoteSubmit, SpotifyTrack } from "$lib/types";
    import type { PageData } from "./$types";
    import { deserialize } from "$app/forms"
    import { goto } from "$app/navigation";

  export let data: PageData

  let formElement: HTMLFormElement
  let inputSong: string
  let searchResults: SpotifyTrack[] = []

  let disableInputs = false
  let disableSearchButton = true
  let showSubmitBanner = "none"
  let submitBannerMessage = ""

  async function searchSong() {

    disableInputs = true
    disableSearchButton = true

    const formData = new FormData(formElement)
    const query = formData.get("s")
    if (!query || query.toString().trim().length < 1) {
      searchResults = []
      return
    }

    const response = await fetch("?/search", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsVoteSearch>>

    disableInputs = false
    disableSearchButton = false

    if (result.success) {
      searchResults = result.data.results
    }
    else {
      searchResults = []
    }

  }

  async function submitSong(song: SpotifyTrack) {

    if (disableInputs) return

    disableInputs = true
    disableSearchButton = true

    const formData = new FormData()
    formData.set("s", song.id)

    const response = await fetch("?/submit", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsVoteSubmit>>

    if (result.success) {
      showSubmitBanner = "success"
      submitBannerMessage = "Der Song wurde erfolgreich hinzugefügt!"
      await new Promise(r => setTimeout(r, 3000));
      goto("/songs")
    }
    else {

      showSubmitBanner = "fail"
      if (result.error.reason === "forbidden") {
        submitBannerMessage = "Du hast für diesen Song bereits abgestimmt!"
      }
      else {
        submitBannerMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es später nochmal."
      }

      inputSong = ""
      searchResults = []
      disableInputs = false
    }

  }

  function checkInput() {
    if (inputSong.trim().length < 1) {
      disableSearchButton = true
    }
    else {
      disableSearchButton = false
    }
    searchResults = []
  }

</script>

<svelte:head>
  <title>RateYourEVI | Song Vorschlagen</title>
</svelte:head>

<main>

  <section class="section">
    <div class="container">
      <h1 class="title">Song Vorschlagen</h1>
      <h2 class="subtitle">Schlagt vor, was als nächstes gespielt werden soll.</h2>
      {#if !data.success && data.error.reason === "unauthorized"}
          <a href="/login?r=/songs/request" class="button is-primary has-text-weight-bold">Log In</a>
        {/if}
    </div>
  </section>

  <div class="container">

    {#if showSubmitBanner === "success"}
      <div class="notification is-primary">
        {submitBannerMessage}
      </div>
    {:else if showSubmitBanner === "fail"}
      <div class="notification is-primary">
        {submitBannerMessage}
      </div>
    {/if}
  
    {#if data.success}
    
    <form bind:this={formElement} class="form">
      <div class="panel">
        <p class="panel-heading">Track, Interpret, Album</p>
        <div class="panel-block">
          <p class="control has-icons-left">
            <input bind:value={inputSong} on:input={checkInput} disabled={disableInputs} type="text" id="s" name="s" placeholder="Suchen" class="input" autocapitalize="off" autocomplete="off" autocorrect="off">
            <span class="icon is-left">
              <img alt="Suchen" src="/search.svg" width="18px">
            </span>
          </p>
          <button disabled={disableSearchButton} on:click|preventDefault={searchSong} id="search-button" class="button is-primary">Suchen</button>
        </div>
        {#each searchResults as song}
        <div class="panel-block">
            <div class="item">
              <a href="#top" on:click={() => submitSong(song)} class={disableInputs ? "disabled has-text-weight-bold" : "has-text-weight-bold"}>{song.name}</a>
              <div>
                {#each song.artists as artist, index}
                  {artist.name}
                  {#if song.artists.length - 1 !== index}   
                    &nbsp;|&nbsp;&nbsp;
                  {/if}
                {/each}
                &nbsp;&mdash;&nbsp;&nbsp;&nbsp;{song.album.name}
              </div>
            </div>
        </div>
        {/each}
      </div>
    
      </form>
  
    {:else}
      
      {#if data.error.reason === "unauthorized"}

      <div class="message">
        <div class="message-header">
          Achtung!
        </div>
        <div class="message-body">
          Um selber Songs vorschlagen zu können, musst du dich erst einloggen.
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

  #search-button {
    margin-left: 20px;
  }

  .item {
    width: 100%;
  }

  .panel-block {
    background-color: #0e1111;
    color: #acacac;
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

  .input::placeholder {
    color: #acacac;
  }

  .disabled {
    cursor: not-allowed;
    color: #acacac !important;
  }

</style>