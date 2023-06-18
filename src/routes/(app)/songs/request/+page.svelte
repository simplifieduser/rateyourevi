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
    if (!query || query.length < 3) {
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
      <h2 class="subtitle">Lorem ipsum dolor sit amet</h2>
    </div>
  </section>

  <div class="container">

    {#if showSubmitBanner === "success"}
      <div class="notification is-success">
        {submitBannerMessage}
      </div>
    {:else if showSubmitBanner === "fail"}
      <div class="notification is-danger">
        {submitBannerMessage}
      </div>
    {/if}
  
    {#if data.success}
    
    <form bind:this={formElement}>
      <div class="panel">
        <p class="panel-heading">Spotify</p>
        <div class="panel-block">
          <div class="control">
            <input bind:value={inputSong} on:input={checkInput} disabled={disableInputs} type="text" id="s" name="s" placeholder="Name" class="input">
          </div>
          <button disabled={disableSearchButton} on:click|preventDefault={searchSong} id="search-button" class="button is-primary">Suchen</button>
        </div>
        {#each searchResults as song}
        <div class="panel-block">
            <div class="item">
              <a href="#top" on:click={() => submitSong(song)} class="has-text-weight-bold">{song.name}</a>
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

      <div class="message is-warning">
        <div class="message-header">
          Achtung!
        </div>
        <div class="message-body">
          Um selber Songs vorschlagen zu können, musst du dich erst einloggen.
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

</style>