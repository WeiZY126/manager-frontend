<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<!--<script scoped setup>-->
<script>
export default {
  data() {
    return {}
  }
};
</script>

<style scoped>
html, body, #app {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
