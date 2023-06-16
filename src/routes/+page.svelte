<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData

  onMount(() => {
    console.log(data)
  })

</script>

<main>

  <section class="hero is-medium is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title is-size-1">
          RateYourEVI
        </p>
        <p class="subtitle is-size-3">
          Abitur 2023
        </p>
      </div>
    </div>
  </section>
  
  {#if data.success}

  <section class="section">
    <div class="container">
      <h1 class="title">Schüler-Rating</h1>
      <h2 class="subtitle">Lorem ipsum dolor sit amet</h2>
      <a href="/rating/vote" class="button is-primary">Abstimmen</a>
    </div>
  </section>
  
  <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box has-background-primary">
          <div class="content has-text-white">
            <h1 class="has-text-white">Abi-König</h1>
            <ol>
              {#each data.data.male as student}
                <li>{student.fullName}</li>
              {/each}
            </ol> 
          </div>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box has-background-primary">
          <div class="content has-text-white">
            <h1 class="has-text-white">Abi-Königen</h1>
            <ol>
              {#each data.data.female as student}
                <li>{student.fullName}</li>
              {/each}
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>



  <section class="section">
    <div class="container">
      <h1 class="title">Songs</h1>
      <h2 class="subtitle">Lorem ipsum dolor sit amet</h2>
      <a href="/songs/request" class="button is-primary">Vorschlagen</a>
    </div>
  </section>
  <div class="container">
    <div class="box has-background-primary">

      <ol>
        {#each data.data.songs as song}
          <li>{song.songName}</li>
        {/each}
      </ol>
    </div>
  </div>

  {:else}

    Es ist ein Fehler aufgetreten.

  {/if}


</main>