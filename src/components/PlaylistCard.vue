<template>
    <div class="playlists">

        <div>
            <v-btn class="custom-button" @click="this.getPlaylists()">
                Load Playlists
            </v-btn>
        </div>

        <v-container class="my-5" v-if="this.playlists !== null">
            <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg3 v-for="playlist in playlists.items" :key="playlist.name">
                    <v-card @click="openCard(playlist)" theme="dark" variant="elevated" width=330px class="playlistcard text-xs-center ma-3" hover> 
                        <v-row>
                            <v-col cols="5">
                        <v-responsive class="pt-4">
                            <v-avatar size="100" class="ml-4">
                                <v-img src="../assets/djdeck-icon.png"></v-img>
                            </v-avatar>
                        </v-responsive>
                            </v-col>
                            <v-col cols="7">
                        <v-card-text>
                            <div class="text-overline mb-1">
                                {{ playlist.name }}
                            </div>
                            <div class="grey--text">
                                {{ playlist.description }}
                            </div>
                        </v-card-text>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-btn color="gray" @click="createSetlist(playlist)">
                                <v-icon small left icon="mdi-headphones"/>
                                <span> Create Setlist </span>
                            </v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                        <div v-show="expandedCard === playlist.name">
                            <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                            </v-card-text>
                        </div>
                        </v-expand-transition>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

    </div>

</template>

<script>
export default {
    data() {
    return {
      playlists: null,
      show:false,
      expandedCard:0
    };
  },
  mounted() {
    // Fetch playlists when the component is mounted
    this.getPlaylists();
  },
  methods: {
    getPlaylists() {
      // Retrieve playlists from local storage
      const storedPlaylists = localStorage.getItem('playlists');

      // Update the playlists data if it's not null
      if (storedPlaylists) {
        this.playlists = JSON.parse(storedPlaylists);
      }
    },
    createSetlist(playlist) {

        console.log(playlist);
        
    },
    openCard(playlist){
        this.expandedCard = playlist.name;
    }
  }

}
</script>

<style scoped>
.playlistcard {
    background-color: #CD8987;
}
.custom-button {
  color :"#CDCACC";
}

</style>
