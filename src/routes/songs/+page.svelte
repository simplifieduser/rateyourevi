<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { deserialize } from "$app/forms"
    import type { SongRequest } from "@prisma/client";
  import type { PageData } from "./$types";
    import type { ServerResponse, SongsVote } from "$lib/types";

  export let data: PageData

  let currentPage = 0
  let showVoteBanner = false
  let voteBannerMessage = ""

  function loadMore() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage)) currentPage = 0
    currentPage += 1

    goto("?p=" + currentPage)

  }

  async function vote(song: SongRequest) {

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

    }
    
    showVoteBanner = true

  }


</script>

<main>

  {#if showVoteBanner}
    {voteBannerMessage}
  {/if}

  {#if data.success}
    <ol>
      {#each data.data.songs as song}
        <li value={data.data.songs.indexOf(song) + currentPage * 20 + 1} >{song.songName} <button on:click|preventDefault={ () => vote(song) }>Vote</button> </li>
      {/each}
    </ol>

  {:else}
    Es ist ein Fehler aufgetreten!
  {/if}

  <button on:click={loadMore} >Mehr Laden</button>

</main>