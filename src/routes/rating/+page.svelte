<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData

</script>

<main>
  {#if data.success}
    <ol>
      {#each data.data.students as student}
        <li>{student.fullName}</li>
      {/each}
    </ol>

  {:else}
    Es ist ein Fehler aufgetreten!
  {/if}
</main>