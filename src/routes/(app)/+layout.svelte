<script lang="ts">
  import { onMount } from "svelte";
  import "$lib/app.scss";

  let isLoggedIn = false;

  onMount(() => {
    isLoggedIn = document.cookie.includes("token");
  });
</script>

<svelte:head>
  <script
    src="https://kit.fontawesome.com/553baf5296.js"
    crossorigin="anonymous"
  ></script>
</svelte:head>

<div class="wrapper">
  <header>
    <nav class="navbar" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="/favicon.png" alt="logo" width="28" height="28" />
          </a>
          <button class="navbar-burger">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
  
        <div class="navbar-menu">
          <div class="navbar-start">
            <a href="/" class="navbar-item">Home</a>
            <a href="/rating" class="navbar-item">Rating</a>
            <a href="/songs" class="navbar-item">Songs</a>
          </div>
  
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                {#if isLoggedIn}
                  <a href="/logout" class="button">
                    <strong>Log Out</strong>
                  </a>
                {:else}
                  <a href="/login" class="button is-primary">
                    <strong>Log In</strong>
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
  
  <slot />
  <div class="footer-wrapper">
    <footer class="footer">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="content">
              <h1 class="title is-4">RateYourEVI</h1>
              <h2 class="subtitle is-5">Evangelische Schule Neuruppin</h2>
              <p>2023</p>
            </div>
          </div>
          <div class="column">
            <div class="menu is-pulled-right has-text-right">
              <ul class="menu-list">
                <li><a href="#top">Nach oben</a></li>
                <li>
                  <a href="https://gymnasium-neuruppin.de/index.php?oid=500" target="_blank">Impressum</a>
                </li>
                <li>
                  <a href="https://gymnasium-neuruppin.de/index.php?oid=500&id=938" target="_blank">Datenschutzerklärung</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>


<style>

  .wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
  }

  .footer-wrapper {
    margin-top: auto;
  }

  footer {
    margin-top: 50px;
  }
  
</style>
