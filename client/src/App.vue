<template>
  <div id="app">
    <MainMenu/>
    <router-view :key="$route.fullPath"></router-view>     
  </div>
</template>

<script>
import MainMenu from './components/menus/MainMenu.vue';

export default {
  name: 'App',
  components: {
    MainMenu,
  }
}
</script>

<style>
#app {
/*  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;*/
}
</style>
