<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let infoText = ""
  let inputPassword = ""

  const reason = $page.url.searchParams.get("r")
  if (!reason) {
    infoText = "Bitte gebe den Admin-Code ein um fortzufahren:"
  }
  else if (reason === "missing") {
    infoText = "Um auf das Admin-Panel zugreifen zu können, benötigst du einen Admin-Code.<br>Bitte gebe diesen ein um fortzufahren:"
  }
  else if (reason === "invalid") {
    infoText = "Der angegebene Admin-Code ist nicht korrekt.<br>Bitte gebe einen gültigen Code ein um fortzufahren:"
  }
  else {
    infoText = "Bitte gebe den Admin-Code ein um fortzufahren:"
  }
  
  onMount(() => {     
    document.cookie = "adminCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin/;"
  })

  function saveCode() {

    document.cookie = `adminCode=${inputPassword}; path="/admin"`
    document.location.assign("/songs/admin")

  }

</script>

<svelte:head>
  <title>RateYourEVI | Admin</title>
</svelte:head>

<main>

  <div class="container">
    <div class="level">
      <form class="level-item form">
      <div class="card is">
        <div class="card-header">
          <p class="card-header-title">Admin Panel</p>
        </div>
        <div class="card-content">
          <div class="content">
            {@html infoText}
          </div>
          <input bind:value={inputPassword} type="text" id="code" name="code" class="input" placeholder="Code">
        </div>
        <div class="card-footer">
          <a href="#top" on:click={saveCode} class="card-footer-item">Prüfen</a>
        </div>
      </div>
      </form>
    </div>
  </div>

</main>