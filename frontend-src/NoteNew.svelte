<script>
  import { onMount, createEventDispatcher } from "svelte";
  import EasyMDE from "easymde";

  import { createNote } from "./api";

  const dispatch = createEventDispatcher();

  let title = "";

  let textarea;

  onMount(() => {
    const mdEditor = new EasyMDE({ element: textarea, forceSync: true, status: false });
    return () => {
      try {
        mdEditor.cleanup();
      } catch (_err) {}
    };
  });

  const save = async () => {
    const text = textarea.value;
    if (!title && !text) {
      return;
    }
    const note = await createNote(title, text);
    dispatch("routeEvent", { type: "note-created", id: note.id });
  };

  const cancel = () => {
    dispatch("routeEvent", { type: "note-create-cancelled" });
  };
</script>

<div class="uk-margin-bottom">
  <button on:click={save} class="uk-button uk-button-primary"><i class="fas fa-save" />&nbsp;Сохранить</button>
  <button on:click={cancel} class="uk-button uk-button-default"><i class="fas fa-undo" />&nbsp;Отмена</button>
</div>

<div class="uk-margin"><input bind:value={title} class="uk-input" type="text" placeholder="Заголовок" /></div>

<div class="uk-margin"><textarea bind:this={textarea} class="uk-textarea" /></div>
