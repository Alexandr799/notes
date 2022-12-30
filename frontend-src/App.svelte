<script>
  import Router from "svelte-spa-router";
  import Main from "./Main.svelte";
  const routes = new Map();
  routes.set(/^\/(.*)?/, Main);
</script>

<Router {routes} />
