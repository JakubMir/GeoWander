<script lang="ts" setup>
import {ref} from "vue";
import {Difficulty, Gamemode} from "@/types";

let selectedGameMode = ref(Gamemode.Standard)
let selectedDifficulty = ref(Difficulty.Easy)
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" md="8">
        <v-card class="text-center pa-10 fill-height">
          <h1 class="text-center text-h3 pb-4 font-weight-bold">Play</h1>

          <h1 class=" mb-2 text-h4 font-weight-regular">Gamemode</h1>
          <v-select v-model="selectedGameMode" :items="Object.values(Gamemode)" variant="outlined"/>

          <h1 class=" mb-2 text-h4 font-weight-regular text-wrap">Difficulty</h1>
          <v-select v-model="selectedDifficulty" :items="Object.values(Difficulty)" variant="outlined"/>

          <v-btn :ripple="false" :to="{name: 'GameScreen', query: { gameMode: selectedGameMode, difficulty: selectedDifficulty }}" color="primary" rounded="xl"
                 size="x-large">Play!
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
