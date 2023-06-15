<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { deserialize } from "$app/forms";
    import type { SongRequest } from "@prisma/client";
    import type { PageServerData } from "./$types";
    import type { SongsAdminRemove } from "$lib/types";

  export let data: PageServerData

  let currentPage = 0
  let showRemoveBanner = false
  let removeBannerMessage = ""

  function loadMore() {

    const currentPageString = $page.url.searchParams.get("p") || "0"
    currentPage = parseInt(currentPageString)
    if (Number.isNaN(currentPage)) currentPage = 0
    currentPage += 1

    goto("?p=" + currentPage)

  }

  async function remove(song: SongRequest) {

    const formData = new FormData()
    formData.set("s", song.id.toString())

    const response = await fetch("?/remove", {
      method: 'POST',
      body: formData
    })

    // @ts-ignore
    const result = deserialize(await response.text()).data as Awaited<ServerResponse<SongsAdminRemove>>

    if (result.success) {
      removeBannerMessage = "Erfolgreich abgestimmt."
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
      
    }
    
    showRemoveBanner = true

  }

</script>

<main>

  {#if showRemoveBanner}
    {removeBannerMessage}
  {/if}

  {#if data.success}
    <ol>
      {#each data.data.songs as song}
        <li value={data.data.songs.indexOf(song) + currentPage * 20 + 1} >{song.songName} <button on:click|preventDefault={ () => remove(song) }>Löschen</button> </li>
      {/each}
    </ol>

  {:else}
    Es ist ein Fehler aufgetreten!
  {/if}

  <button on:click={loadMore} >Mehr Laden</button>

</main>