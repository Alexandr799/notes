<script>
  import { onMount, createEventDispatcher } from "svelte";
  import EasyMDE from "easymde";

  import Progress from "./Progress.svelte";
  import { getNote, editNote, notePdfUrl } from "./api";

  export let params;

  const dispatch = createEventDispatcher();

  let title;
  let textarea;
  let fetching;

  onMount(() => {
    let mdEditor;

    fetching = getNote(params.id).then((data) => {
      title = data.title;
      setTimeout(() => {
        mdEditor = new EasyMDE({ element: textarea, forceSync: true, status: false, initialValue: data.text });
      });
    });

    return () => {
      try {
        mdEditor && mdEditor.cleanup();
      } catch (_err) {}
    };
  });

  const save = async () => {
    const text = textarea.value;
    if (!title && !text) {
      return;
    }
    await editNote(params.id, title, text);
    dispatch("routeEvent", { type: "note-edited", id: params.id });
  };

  const cancel = () => {
    dispatch("routeEvent", { type: "note-edit-cancelled", id: params.id });
  };
</script>

{#await fetching}
  <Progress />
{:then _}
  <div class="uk-margin-bottom">
    <button on:click={save} class="uk-button uk-button-primary"><i class="fas fa-save" />&nbsp;Сохранить</button>
    <button on:click={cancel} class="uk-button uk-button-default"><i class="fas fa-undo" />&nbsp;Отмена</button>
  </div>

  <div class="uk-margin"><input bind:value={title} class="uk-input" type="text" placeholder="Заголовок" /></div>

  <div class="uk-margin"><textarea bind:this={textarea} class="uk-textarea" /></div>
{:catch error}
  <div class="uk-alert uk-alert-danger">
    <p>Ошибка: {error.message}.</p>
  </div>
{/await}
