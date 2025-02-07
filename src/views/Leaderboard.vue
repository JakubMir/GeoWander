<script lang="ts" setup>
import {ref, computed, onMounted} from "vue"
import {useAuthStore} from "@/store/auth"
import {Game} from "@/model/Game"
import Loading from "@/components/Loading.vue"
import {useGameStore} from "@/store/games"
import Error from "@/components/Error.vue"

const authStore = useAuthStore()
const gameStore = useGameStore()
const isAuthenticated = computed(() => authStore.authenticated)

let gameList = ref<Array<Game>>([])

onMounted(async () => {
  if (isAuthenticated)
    try {
      await gameStore.fetchLeaderboardGames()
      gameList.value = gameStore.games
    } catch (err) {
      console.error(err)
    }
})
</script>

<template>
  <v-container>
    <Error v-if="gameStore.error" :message="gameStore.error"/>
    <v-row v-else justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-5 ">
          <v-row align="start" justify="center">
            <h1 class="text-center pb-4">Leaderboard</h1>
          </v-row>
          <v-row v-if="gameStore.isLoading">
            <v-col class="text-center" cols="12">
              <Loading/>
            </v-col>
          </v-row>

          <v-row v-else dense>
            <v-row align="end" class="text-center" justify="center">
              <!-- 2. place -->
              <v-col cols="12" order="2" order-sm="1" sm="4">
                <v-card class="leaderboard-card bg-grey-lighten-1 rounded-xl shadow-md">
                  <v-card-text class="text-h5 py-0 font-weight-medium">2.</v-card-text>
                  <v-card-text class="text-h6 py-0 font-weight-medium">{{ gameList[1]?.username }}</v-card-text>
                  <v-card-text class="text-h6 py-0 font-weight-medium">{{ gameList[1]?.guessed }}</v-card-text>
                </v-card>
              </v-col>
              <!-- 1. place -->
              <v-col cols="12" order="1" order-sm="2" sm="4">
                <v-card class="leaderboard-card bg-amber-accent-3 rounded-xl shadow-2xl">
                  <v-card-text class="text-sm-h4 text-h5 py-0 font-weight-bold">1.</v-card-text>
                  <v-card-text class="text-sm-h5 text-h6 py-0 font-weight-medium">{{ gameList[0]?.username }}
                  </v-card-text>
                  <v-card-text class="text-sm-h5 text-h6 py-0 font-weight-medium">{{ gameList[0]?.guessed }}
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- 3. place -->
              <v-col cols="12" order="3" order-sm="3" sm="4">
                <v-card class="leaderboard-card bg-brown-lighten-2 text-black rounded-xl shadow-md">
                  <v-card-text class="text-h5 py-0 font-weight-medium">3.</v-card-text>
                  <v-card-text class="text-h6 py-0 font-weight-medium">{{ gameList[2]?.username }}</v-card-text>
                  <v-card-text class="text-h6 py-0 font-weight-medium">{{ gameList[2]?.guessed }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Rest of leaderboard -->
            <v-row>
              <v-col v-for="(player, index) in gameList.slice(3)" :key="index" class="py-2" cols="12">
                <v-card id="LeaderboardCard" :class="{
                  'leaderboard-card': true,
                  'bg-blue-grey-lighten-5': index % 2 === 0,
                  'bg-blue-grey-lighten-3': index % 2 !== 0
                  }" class="py-2  rounded-lg shadow-sm" variant="elevated">
                  <v-row class="text-black">
                    <v-col class="d-flex align-center pr-0" cols="auto">
                      <v-card-text class="text-h6 py-0 pr-0 font-weight-bold">{{ index + 4 }}.</v-card-text>
                    </v-col>
                    <v-col cols="auto">
                      <v-card-text class="text-h6 pl-0 fill-height">
                        <p><strong>{{ player?.username }}</strong></p>
                      </v-card-text>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                      <v-card-text class="text-h6">
                        <p><strong>{{ player.guessed }}</strong></p>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.leaderboard-card .text-h5,
.leaderboard-card .text-h6 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
