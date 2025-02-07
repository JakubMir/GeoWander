<script lang="ts" setup>
import {Difficulty, Gamemode} from "@/types"
import {computed, onMounted, ref} from "vue"
import {useCountriesStore} from "@/store/countries"
import {Country} from "@/model/Country"
import Loading from "@/components/Loading.vue"
import router from "@/router"
import {useAuthStore} from "@/store/auth"
import {useGameStore} from "@/store/games";

// get props from previous route
const props = defineProps({
  gameMode: {
    type: String,
    required: true,
    default: Gamemode.Standard
  },
  difficulty: {
    type: String,
    required: true,
    default: Difficulty.Easy
  }
})

const gameStore = useGameStore()

let initialized = false

// set max mistakes by difficulty - easy = 5, medium = 3, hard = 1
const maxMistakes = 5 - Object.keys(Difficulty).indexOf(<string>props.difficulty) * 2

const mistakes = ref<number>(0)
const correctAnswers = ref<number>(0)
const currentRound = ref<number>(0)

// check if the game is over
const gameOver = computed(() => mistakes.value === maxMistakes)

// Timer after answer
const timer = ref(3)

const countriesStore = useCountriesStore()

const countryList = computed<Array<Country>>(() => {
  return countriesStore.countries
})

const getFlagSrc = computed(() => (country: Country) => {
  return country.flags?.svg || ''
})

// get current country name
const correctAnswer = computed(() => {
  const currentCountry = countryList.value.at(currentRound.value)
  return currentCountry ? currentCountry.name.common : ''
})

// create answers
const options = computed(() => {
  const currentCountry = countryList.value.at(currentRound.value)
  if (!currentCountry) return []

  // get all wrong options
  const wrongOptions = countryList.value
    .filter((country) => country.name.common !== currentCountry.name.common)
    .sort(() => 0.5 - Math.random()) // shuffle the wrong options
    .slice(0, 3) // take the first three shuffled wrong options


  // unwrap wrong options and shuffle all options
  return [...wrongOptions, currentCountry].sort(() => 0.5 - Math.random())
})

const buttonStates = ref<{ [key: string]: 'correct' | 'incorrect' }>({})

const buttonsDisabled = ref(false)

// check if the answer match the current country name
const checkAnswer = async (selectedAnswer: string) => {
  const correct = selectedAnswer === correctAnswer.value
  if (correct) {
    correctAnswers.value++
    buttonStates.value[selectedAnswer] = 'correct'
  } else {
    mistakes.value++
    buttonStates.value[selectedAnswer] = 'incorrect' // mark the selected wrong answer
    buttonStates.value[correctAnswer.value] = 'correct' // mark the correct answer
  }

  buttonsDisabled.value = true

  if (!gameOver.value) {
    timer.value = 3
    const countdownInterval = setInterval(() => {
      timer.value--
      if (timer.value === 0) {
        clearInterval(countdownInterval)
        if (!gameOver.value) {
          currentRound.value++
          buttonStates.value = {}
          buttonsDisabled.value = false
        }
      }
    }, 1000)
  } else {
    await addGame()
  }
}

const initializeGame = () => {
  if (!initialized) {
    // Fetch countries and shuffle the list
    countriesStore.fetchCountries().then(() => {
      shuffleCountryList()
    })
    initialized = true
    mistakes.value = 0
    correctAnswers.value = 0
    currentRound.value = 0
    buttonsDisabled.value = false
  }
}

const restartGame = () => {
  initialized = false
  initializeGame()
}

function endGame() {
  addGame()
  router.push({name: 'Home'})
}

const shuffleCountryList = () => {
  countryList.value.sort(() => Math.random() - 0.5)
}

async function addGame() {
  const authStore = useAuthStore()

  await authStore.getUsername().then(async () => {
    const username = authStore.user?.username

    if (!username) {
      console.error("Error: Username is not defined.")
      return
    }
    if (props.difficulty)
      try {
        await gameStore.insertGame(username, props.difficulty, correctAnswers.value)
      } catch (e) {
        console.error("Error adding document: ", e)
      }
  }).catch((e) => {
    console.error("Error fetching username: ", e)
  })
}

onMounted(() => {
  initializeGame()
})

</script>

<template>
  <v-container>
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn color="red" rounded="xl" @click="endGame">Quit game ?</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="countriesStore.isLoading">
      <v-col class="text-center bg-white" cols="12">
        <Loading/>
      </v-col>
    </v-row>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-img v-if="initialized" :src="getFlagSrc(countryList[currentRound])" aspect-ratio="16/9"
                 max-height="250"></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center" cols="12">
          <h1 class="mt-5 mb-2 text-h4 font-weight-regular">Mistakes: {{ mistakes }}/{{ maxMistakes }}</h1>
          <h1 class="mt-5 mb-2 text-h4 font-weight-regular">Correct guesses: {{ correctAnswers }}</h1>
        </v-col>
      </v-row>
      <v-row class="mt-5" justify="center">
        <v-btn v-if="gameOver" class="text-black" rounded="xl" size="x-large" @click="restartGame">New game</v-btn>
        <p v-else-if="timer > 0 && buttonsDisabled" class="text-center">Next round in: {{ timer }} seconds</p>
        <p v-else>&nbsp</p>
      </v-row>
      <v-row class="text-black bg-transparent  mt-sm-10 mt-0" justify="center">
        <v-col
          v-for="option in options"
          :key="option.name.common"
          class="d-flex justify-center"
          cols="12"
          md="6"
          sm="6"
        >
          <v-btn
            :class="{
                'btn-correct': buttonStates[option.name.common] === 'correct',
                'btn-incorrect': buttonStates[option.name.common] === 'incorrect',
                'disable-events': buttonsDisabled
              }"
            class="w-100"
            rounded="xl" size="x-large"
            @click="checkAnswer(option.name.common)"
          >
            {{ option.name.common }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.btn-correct {
  background-color: green;
  color: white;
}

.btn-incorrect {
  background-color: red;
  color: white;
}

/*wrap long text*/
:deep(.v-btn__content) {
  white-space: pre-wrap
}

/*disable button click but keep colors*/
.disable-events {
  pointer-events: none
}
</style>
