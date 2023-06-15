<script lang="ts">
    import { goto } from "$app/navigation";
  import { page } from "$app/stores";
    import { onMount } from "svelte";


  const reason = $page.url.searchParams.get("r")
  let infoText = ""

  let inputPassword = ""

  onMount(() => {

    document.cookie = "adminCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin/;"

    if (!reason) {
      infoText = "Bitte gebe den Admin-Code ein um fortzufahren:"
    }
    else if (reason === "missing") {
      infoText = "Um auf das Admin-Panel zugreifen zu können, benötigst du einen Admin-Code. Bitte gebe diesen ein um fortzufahren:"
    }
    else if (reason === "invalid") {
      infoText = "Der angegebene Admin-Code ist nicht korrekt. Bitte gebe einen gültigen Code ein um fortzufahren:"
    }
    else {
      infoText = "Bitte gebe den Admin-Code ein um fortzufahren:"
    }

  })

  function saveCode() {

    document.cookie = `adminCode=${inputPassword}; path="/admin"`
    goto("/songs/admin")

  }

</script>

<main>
  <form>
    <label>
      {infoText}<br>
      <input bind:value={inputPassword} type="text" id="code" name="code">
    </label>
    <button on:click|preventDefault={saveCode}>Prüfen</button>
  </form>

</main>