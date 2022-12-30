<script>
  import { onMount } from "svelte";

  export let step = 10;
  export let updateInterval = 50;

  let progress = 0,
    direction = 1;

  onMount(() => {
    const progressInterval = setInterval(() => {
      progress += step * direction;
      if (progress > 100) {
        progress = 100;
      } else if (progress < 0) {
        progress = 0;
      }
      if (progress === 100 && direction === 1) {
        direction = -1;
      } else if (progress === 0 && direction === -1) {
        direction = -1;
      }
    }, updateInterval);

    return () => {
      clearInterval(progressInterval);
    };
  });
</script>

<progress class="uk-progress" value={progress} max="100" />
