<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { deserialize } from "$app/forms"
  import type { SongRequest } from "@prisma/client";
  import type { PageData } from "./$types";
  import type { ServerResponse, SongsVote } from "$lib/types";

  export let data: PageData

  let currentPage = 0
  let showVoteBanner = "none"
  let voteBannerMessage = ""
  let disableVoteButtons = false

  function loadMore() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage)) currentPage = 0
    currentPage += 1

    goto("?p=" + currentPage)

  }

  async function vote(song: SongRequest) {

    disableVoteButtons = true

    const formData = new FormData()
    formData.set("s", song.id.toString())

    const response = await fetch("?/vote", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsVote>>

    if (result.success) {
      voteBannerMessage = "Erfolgreich abgestimmt."
      showVoteBanner = "success"
    }
    else {

      if (result.error.reason === "unauthorized") {
        voteBannerMessage = "Bitte logge dich ein, um für Songs abstimmen zu können."
      }
      else if (result.error.reason === "forbidden") {
        voteBannerMessage = "Du hast für diesen Song bereits abgestimmt."
      }
      else {
        voteBannerMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es später nochmal."
      }

      showVoteBanner = "fail"

    }

    disableVoteButtons = false

  }


</script>

<svelte:head>
  <title>RateYourEVI | Song Vorschläge</title>
</svelte:head>

<main>

  <div class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title">
          Song Vorschläge
        </p>
        <p class="subtitle">
          Abitur 2023
        </p>
      </div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <h1 class="title is-4">Liste aller Song Vorschläge</h1>
      <h2 class="subtitle is-5">Lorem ipsum dolor sit amet</h2>
      <div class="level">
        <a href="/songs/request" class="button is-primary">Neuer Vorschlag</a>
      </div>
      </div>
  </section>

  {#if data.success}
  <div class="container">

  {#if showVoteBanner === "success"}
    <div class="notification is-success">
      {voteBannerMessage}
    </div>
  {:else if showVoteBanner === "fail"}
    <div class="notification is-danger">
      {voteBannerMessage}
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
            <td>
              <p class="buttons is-pulled-right">
                <button on:click|preventDefault={ () => vote(song) } disabled={disableVoteButtons} class="button">
                  <span class="icon is-small">
                    <img alt="Thumbs Up" src="./thumbs-up.svg" width="18px">
                  </span>
                </button>
                <a href={song.songUrl} target="_blank" class="button">
                  <span class="icon is-small">
                    <img alt="Spotify Link" src="./link.svg" width="18px">
                  </span>
                </a>
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
    <article class="message is-danger">
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
    min-width: 800px;
  }

</style>