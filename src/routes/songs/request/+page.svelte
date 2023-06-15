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
  let showSubmitBanner = false
  let submitBannerMessage = ""

  async function searchSong() {

    disableInputs = true

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

    if (result.success) {
      searchResults = result.data.results
    }
    else {
      searchResults = []
    }

  }

  async function submitSong(song: SpotifyTrack) {

    disableInputs = true

    const formData = new FormData()
    formData.set("s", song.id)

    const response = await fetch("?/submit", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsVoteSubmit>>

    if (result.success) {
      showSubmitBanner = true
      submitBannerMessage = "Der Song wurde erfolgreich hinzugefügt!"
      await new Promise(r => setTimeout(r, 3000));
      goto("/songs")
    }
    else {

      showSubmitBanner = true
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

</script>

<main>

  {#if showSubmitBanner}
    {submitBannerMessage}
  {/if}

  {#if data.success}
  
    <form bind:this={formElement}>
      <input bind:value={inputSong} disabled={disableInputs} type="text" id="s" name="s">
      <button disabled={disableInputs} on:click|preventDefault={searchSong}>Suchen</button>
    </form>

    <div class="results">
      {#each searchResults as song}
        <button disabled={disableInputs} on:click={() => submitSong(song)} >{song.name} | {song.artists[0].name}</button>
      {/each}
    </div>


  {:else}
    
    {#if data.error.reason === "unauthorized"}
      Bitte <a href="/login">logge</a> dich ein um selber Songs hinzufügen zu können!
    {:else}
      Es ist ein Fehler aufgetreten.
    {/if}

  {/if}


</main>

<style>

  .results {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

</style>