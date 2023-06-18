<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<svelte:head>
  <title>RateYourEVI | Home</title>
</svelte:head>

<main>
  <section class="hero is-medium is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title is-size-1">RateYourEVI</p>
        <p class="subtitle is-size-3">Abitur 2023</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h1 class="title">Schüler-Rating</h1>
      <h2 class="subtitle">Lorem ipsum dolor sit amet</h2>
      <div class="buttons">
        <a href="/rating/vote" class="button is-primary">Abstimmen</a>
        <a href="/rating" class="button">Mehr Anzeigen</a>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="content box has-background-primary has-text-white">
          {#if data.success}
            <h1 class="has-text-white">Abi-König</h1>
            <ol>
              {#each data.data.male as student}
                <li>{student.fullName}</li>
              {/each}
            </ol>
          {:else}
            <article class="message is-danger">
              <div class="message-header">
                <p>Fehler</p>
              </div>
              <div class="message-body">
                Es ist ein unerwarteter Fehler beim Laden aufgetreten. Bitte
                versuche es später nochmal.
              </div>
            </article>
          {/if}
        </div>
      </div>
      <div class="column">
        <div class="content box has-background-primary has-text-white">
          {#if data.success}
            <h1 class="has-text-white">Abi-Königen</h1>
            <ol>
              {#each data.data.female as student}
                <li>{student.fullName}</li>
              {/each}
            </ol>
          {:else}
            <article class="message is-danger">
              <div class="message-header">
                <p>Fehler</p>
              </div>
              <div class="message-body">
                Es ist ein unerwarteter Fehler beim Laden aufgetreten. Bitte
                versuche es später nochmal.
              </div>
            </article>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <h1 class="title">Songs</h1>
      <h2 class="subtitle">Lorem ipsum dolor sit amet</h2>
      <div class="buttons">
        <a href="/songs/request" class="button is-primary">Vorschlagen</a>
        <a href="/songs" class="button">Mehr Anzeigen</a>
      </div>
    </div>
  </section>
  <div class="container">
    <div class="columns">
      <div class="column is-half">
        <div class="content box has-background-primary has-text-white">
          {#if data.success}
            <h1 class="title has-text-white">Song Vorschläge</h1>
            {#if data.data.songs.length > 0}
            <ol>
              {#each data.data.songs as song}
                <li>{song.songName}</li>
              {/each}
            </ol>
            {:else}
              Keine weiteren Songs wurden vorgeschlagen.
            {/if}
          {:else}
            <article class="message is-danger">
              <div class="message-header">
                <p>Fehler</p>
              </div>
              <div class="message-body">
                Es ist ein unerwarteter Fehler beim Laden aufgetreten. Bitte
                versuche es später nochmal.
              </div>
            </article>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>
