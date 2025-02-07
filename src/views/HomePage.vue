<script setup lang="ts">

</script>

<template>
  <div class="bg-image"></div>
  <div class="bg-text">
    <h1 class="mb-6">GeoWander</h1>
    <h2 class="mb-6">Explore countries the fun way!</h2>
    <p class="mb-6">Join our game and become the best in world leaderboard!</p>
    <v-btn id="HomePagePlayButton" :to="{name: 'PlayScreen'}" rounded="xl" class="v-btn--size-x-large" color="primary">Play!</v-btn>
  </div>
</template>

<style>
.bg-image {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.63), rgba(0, 0, 0, 0.623)),  url("../assets/photo_play.jpg");
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-text {
  color: white;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 100%;
  text-align: center;
}
</style>
