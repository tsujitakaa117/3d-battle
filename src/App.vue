<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>3D Battle</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <router-link to="/" class="nav-link">Home</router-link>
      </v-btn>
      <v-btn text>
        <router-link to="/battle" class="nav-link">Battle</router-link>
      </v-btn>
      <v-btn text>
        <router-link to="/ranking" class="nav-link">Ranking</router-link>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer 
      class="bg-indigo lighten-1 text-center d-flex flex-column pa-4 height-10px"
    >
    </v-footer>
  </v-app>
</template>


<script>

export default {
  name: 'App',
};
</script>

