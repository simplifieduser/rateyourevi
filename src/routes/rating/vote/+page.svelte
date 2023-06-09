<script lang="ts">
  import { applyAction, deserialize } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  
  export let data: PageData
  export let form: ActionData

  let formElement: HTMLFormElement

  async function maleSearch() {

    const formData = new FormData(formElement)
    const query = formData.get("m")
    if (!query || query.length < 3) return

    const response = await fetch("?/maleSearch", {
      method: 'POST',
      body: formData
    })

    const result = deserialize(await response.text())
    console.log(result.data)

  }
  
  async function femaleSearch() {

    const formData = new FormData(formElement)
    const query = formData.get("m")
    if (!query || query.length < 3) return

    const response = await fetch("?/femaleSearch", {
      method: 'POST',
      body: formData
    })

    const result = deserialize(await response.text())
    console.log(result.data)
  
  }

</script>

<main>

  {#if data.success}

    <form bind:this={formElement}>

      <input on:input={maleSearch} id="m" name="m" type="text" placeholder="King">
      <input on:input={femaleSearch} id="f" name="f" type="text" placeholder="Queen">

      <button>Wählen</button>

    </form>

  {:else}

    {#if data.error.reason === "unauthorized"}
      
      Bitte <a href="/login">logge</a> dich ein um selber abstimmen zu können!

    {:else}

      Es ist ein Fehler aufgetreten.

    {/if}

  {/if}


  

</main>