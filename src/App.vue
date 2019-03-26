<template>
  <div id="vueApp">
    <navigation-bar></navigation-bar>
    <section class="viewBox">
      <router-view/>
    </section>
  </div>
</template>

<script>
  import NavigationBar from "./components/NavigationBar";
  export default {
    components: { NavigationBar }
  }
</script>

<style>

  #vueApp {
    height: 100%;
    left: 0px;
    position: absolute;
    top: 0px;
    width: 100%;
    z-index: 100;
  }

  p {
    margin: 1ex 0ex !important;
  }

  .viewBox {
    padding: 20px 15px;
  }

  .viewForm {
    margin: 10px 0px;
    padding-left: 5px;
  }

  /* Fade transition classes for the "Loading..." message */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .router-link-active {
    border-bottom: 1px solid blue !important;
    font-size: 110%;
    font-weight:bold;
  }

  input.colorInputBox {
    width: 6em;
  }

</style>