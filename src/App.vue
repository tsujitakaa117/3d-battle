<template>
  <div id="app">
    <h1>3D Battle</h1>
    <router-link to="/battle">Battle</router-link>
    <router-link to="/home">Home</router-link>
  </div>
  <router-view></router-view>
</template>


<script>
export default {
  name: 'App',
};
</script>

