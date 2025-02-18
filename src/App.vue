

<template>
  <v-app class="app">
      <HomeIcon @request="requestOAuth()"/>
      <PlaylistHeader/>
      <Menu/>
    <PlaylistCard @click="onPageLoad()"/>
  </v-app>

</template>

<script>

import * as auth from "./api/auth.js";

import HomeIcon from './components/HomeIcon.vue'
import PlaylistCard from './components/PlaylistCard.vue'
import Menu from './components/Menu.vue'
import PlaylistHeader from './components/PlaylistHeader.vue'

export default {
  name: 'App',
  components: {
    HomeIcon,
    PlaylistHeader,
    PlaylistCard,
    Menu
  },
  methods: {
    requestOAuth() {
      auth.requestOAuth();
    },
    onPageLoad() {
      auth.onPageLoad();
    }

  }
}
</script>

<style scoped>
.app {
  background-color: #CDD6DD;
}
</style>

