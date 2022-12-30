<script>
  import { createEventDispatcher } from "svelte";

  import { getNote, archiveNote, unarchiveNote, deleteNote, notePdfUrl } from "./api";

  import Progress from "./Progress.svelte";

  export let params;

  const dispatch = createEventDispatcher();

  $: p = getNote(params.id);

  const close = async () => {
    dispatch("routeEvent", { type: "note-closed", id: params.id });
  };

  const doArchive = async () => {
    await archiveNote(params.id);
    dispatch("routeEvent", { type: "note-archived", id: params.id });
  };

  const doDelete = async () => {
    await deleteNote(params.id);
    dispatch("routeEvent", { type: "note-deleted", id: params.id });
  };

  const doUnarchive = async () => {
    await unarchiveNote(params.id);
    dispatch("routeEvent", { type: "note-unarchived", id: params.id });
  };

  const doEdit = () => {
    dispatch("routeEvent", { type: "note-edit-started", id: params.id });
  };
</script>

{#await p}
  <Progress />
{:then entry}
  <h1>{entry.title}</h1>
  <div class="uk-margin-bottom">
    {#if entry.isArchived}
      <button on:click={doDelete} class="uk-button uk-button-default"><i class="fas fa-trash" />&nbsp;Удалить</button>
      <button on:click={doUnarchive} class="uk-button uk-button-default"><i
          class="fas fa-archive" />&nbsp;Восстановить</button>
    {:else}
      <button on:click={doArchive} class="uk-button uk-button-default"><i class="fas fa-archive" />&nbsp;В архив</button>
    {/if}

    <button on:click={doEdit} class="uk-button uk-button-primary"><i class="fas fa-edit" />&nbsp;Редактировать</button>
    <a href={notePdfUrl(entry.id)} class="uk-button uk-button-secondary"><i
        class="fas fa-file-download" />&nbsp;PDF</a>
    <button on:click={close} class="uk-button uk-button-default"><i class="fas fa-times" />&nbsp;Закрыть</button>
  </div>
  <div class="uk-card uk-card-default uk-card-body">
    {@html entry.html}
  </div>
{:catch error}
  <div class="uk-alert uk-alert-danger">
    <p>Ошибка: {error.message}.</p>
  </div>
{/await}
