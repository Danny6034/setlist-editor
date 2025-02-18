<template>
    <div class="homeicon">
      <img ref="homeicon" alt="logo" :src=image @click="requestAuthorization">
      <h2>Login</h2>
    </div>
  </template>
  
<script>
export default {
  data() {
    return {
      image: require('../assets/djdeck-icon.png')
    }
  },
  methods: {
    requestAuthorization() {
      this.$emit('request');

    }
  }
}
</script>

  <!-- handles hover animation -->
  <style scoped>
  img {
    width: 100px;
    transition: width 0.8s;
  }
  
  img:hover {
    width: 130px;
  }

  .homeicon {
    text-align: center;
    margin-top: 60px;
  }
  
  </style>
  