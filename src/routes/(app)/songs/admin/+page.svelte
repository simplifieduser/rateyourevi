<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { deserialize } from "$app/forms";
    import type { SongRequest } from "@prisma/client";
    import type { PageServerData } from "./$types";
    import type { SongsAdminRemove } from "$lib/types";

  export let data: PageServerData

  let currentPage = 0
  let showRemoveBanner = "none"
  let removeBannerMessage = ""
  let disableInputs = false

  function loadMore() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage)) currentPage = 0
    currentPage += 1

    goto("?p=" + currentPage)

  }

  async function remove(song: SongRequest) {

    disableInputs = true

    const formData = new FormData()
    formData.set("s", song.id.toString())

    const response = await fetch("?/remove", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsAdminRemove>>

    if (result.success) {
      removeBannerMessage = "Erfolgreich gelöscht."
      showRemoveBanner = "success"
      await invalidateAll()
    }
    else {

      if (result.error.reason === "unauthorized") {
        removeBannerMessage = "Bitte logge dich ein, um für Songs abstimmen zu können."
      }
      else if (result.error.reason === "forbidden") {
        removeBannerMessage = "Du hast für diesen Song bereits abgestimmt."
      }
      else {
        removeBannerMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es später nochmal."
      }

      showRemoveBanner = "fail"
      
    }

    disableInputs = false

  }

</script>

<svelte:head>
  <title>RateYourEVI | Admin</title>
</svelte:head>

<main>

  <section class="section">
    <div class="container">
      <h1 class="title is-4">Admin Panel</h1>
      <h2 class="subtitle is-5">Liste aller Song Vorschläge</h2>
    </div>
  </section>

  {#if data.success}
  <div class="container">

  {#if showRemoveBanner === "success"}
    <div class="notification is-primary">
      {removeBannerMessage}
    </div>
  {:else if showRemoveBanner === "fail"}
    <div class="notification is-primary">
      {removeBannerMessage}
    </div>
  {/if}

  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Nr.</th>
          <th>Votes</th>
          <th>Track</th>
          <th>Artists</th>
          <th>Album</th>
          <th>Link</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.data.songs as song}
          <tr>
            <td>{data.data.songs.indexOf(song) + currentPage * 20 + 1}.</td>
            <td>{song.totalVotes}</td>
            <th>{song.songName}</th>
            <td>
              {#each song.songArtist.split("~") as artist, index}
                {artist}
                {#if song.songArtist.split("~").length - 1 !== index}<br>{/if}
              {/each}
            </td>
            <td>{song.songAlbum}</td>
            <td><a href={song.songUrl}>{song.songUrl}</a></td>
            <td>
              <p class="buttons is-pulled-right">
                <button on:click|preventDefault={ () => remove(song) } disabled={disableInputs} class="button">
                  <span class="icon is-small">
                    <img alt="Löschen" src="/xmark.svg" width="18px">
                  </span>
                </button>
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
    <div class="level">
      <div class="level-item">
        <button on:click={loadMore} class="button">Mehr Laden</button>
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

</main>

<style>

  .buttons {
    flex-wrap: nowrap;
  }

  table {
    min-width: 1000px;
  }

</style>