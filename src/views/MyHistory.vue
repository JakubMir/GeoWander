<script lang="ts" setup>
import {ref, computed, onMounted} from "vue";
import {auth} from "@/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {Game} from "@/model/Game";
import {GameHistorySortingOptions} from "@/model/GameHistorySortingOptions";
import {GameHistoryDifficultyOptions} from "@/model/GameHistoryDifficultyOptions";
import {useGameStore} from "@/store/games";
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";

const gameStore = useGameStore()

let games = ref<Array<Game>>([])

const sortByOptions = Object.values(GameHistorySortingOptions)
const selectedSortByOption = ref(sortByOptions[0])

const difficultyOptions = Object.values(GameHistoryDifficultyOptions)
const selectedDifficultyOption = ref(difficultyOptions[0])

function parseDate(dateString: string) {
  const [day, month, year, hour, minute, second] = dateString
    .replace(',', '')
    .split(/[\s.:]+/)
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
}

const sortedHistory = computed(() => {
  // Check if list is not empty
  if (games.value) {
    let sortedGames: Game[] = []
    // Sort by selected sorting option
    switch (selectedSortByOption.value) {
      case GameHistorySortingOptions.NEWEST:
        sortedGames = games.value.slice().sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
        break
      case GameHistorySortingOptions.LATEST:
        sortedGames = games.value.slice().sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
        break
      case GameHistorySortingOptions.WORST:
        sortedGames = games.value.slice().sort((a, b) => a.guessed - b.guessed)
        break
      case GameHistorySortingOptions.BEST:
        sortedGames = games.value.slice().sort((a, b) => b.guessed - a.guessed)
        break
      default:
        break
    }
    // Filter sorted games if there is selected difficulty filter
    if (selectedDifficultyOption.value !== GameHistoryDifficultyOptions.ALL) {
      return sortedGames.filter((g) => g.difficulty === selectedDifficultyOption.value)
    } else {
      return sortedGames
    }
  }
})

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user)
      try {
        await gameStore.getGamesByUser(user.uid)
        games.value = gameStore.games
      } catch (err) {
        console.error(err)
      }
  })
})
</script>

<template>
  <v-container>
    <Error v-if="gameStore.error" :message="gameStore.error"/>
    <v-row v-else justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-5">
          <v-row align="start" justify="center">
            <h1 class="text-center pb-4">My history</h1>
          </v-row>
          <v-row v-if="gameStore.isLoading">
            <v-col class="text-center" cols="12">
              <Loading/>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <v-row justify="center">
                <v-col cols="12" md="6" sm="12">
                  <v-select
                    id="MyHistorySelectDifficulty"
                    v-model="selectedDifficultyOption"
                    :items="difficultyOptions"
                    label="Filter by Difficulty"
                    variant="outlined"
                  ></v-select>

                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-select
                    id="MyHistorySelectSort"
                    v-model="selectedSortByOption"
                    :items="sortByOptions"
                    label="Sort by"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="sortedHistory.length === 0" class="text-center" cols="12">
              <h1 class="text-h4">Your history is empty</h1>
            </v-col>
            <v-col v-for="(game, index) in sortedHistory" v-else :key="index" cols="12">
              <v-card id="MyHistoryCard" color="blue-grey-lighten-5">
                <v-row dense>
                  <v-col class="d-flex align-center" cols="auto">
                    <v-card-text class="text-h5 pr-0 font-weight-medium">{{ index + 1 }}.</v-card-text>
                  </v-col>
                  <v-col cols="auto">
                    <v-card-text class="text-h6">
                      <p><strong>Flags guessed:</strong> {{ game.guessed }}</p>
                      <p><strong>Difficulty:</strong> {{ game.difficulty }}</p>
                      <p><strong>Date:</strong> {{ game.date }}</p>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>


