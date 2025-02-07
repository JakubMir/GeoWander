import {defineStore} from "pinia";
import {ref} from "vue";
import {Game} from "@/model/Game";
import {addDoc, collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {auth, firestore} from "@/firebase";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export const useGameStore = defineStore('rename', () => {
  const games = ref<Array<Game>>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchLeaderboardGames = async () => {
    isLoading.value = true
    error.value = null
    try {
      let q = query(collection(firestore, "games"))

      q = query(q, orderBy("guessed"))

      const querySnapshot = await getDocs(q)

      let playerGames: Array<Game> = []

      querySnapshot.forEach((doc) => {
        const fields = Object.assign(doc.data())

        const game: Game = {
          date: fields.date.toDate().toLocaleDateString() + ", " + fields.date.toDate().toLocaleTimeString(),
          difficulty: fields.difficulty,
          guessed: fields.guessed,
          user_id: fields.user_id,
          username: fields.username,
          id: doc.id
        }

        // If player has 0 games or actual record has more correct answers than saved record, update list
        if (!playerGames[fields.username] || game.guessed > playerGames[fields.username]?.guessed) {
          playerGames[fields.username || 0] = game
        }
        playerGames.push(game)
      })

      // Get the highest score for each user
      const maxGuessedById = playerGames.reduce((acc, item) => {
        if (!acc[item.user_id] || item.guessed > acc[item.user_id].guessed) {
          acc[item.user_id] = item
        }
        return acc
      }, {} as { [key: string]: Game })

      games.value = Object.values(maxGuessedById)

      games.value = games.value.sort((a, b) => b.guessed - a.guessed)
    } catch (e) {
      error.value = "Error during loading country"
      throw new Error(error.value)

    } finally {
      isLoading.value = false
    }
  }


  const getGamesByUser = async (userId: string) => {
    isLoading.value = true
    error.value = null
    try {
      let q = query(collection(firestore, "games"), where("user_id", "==", userId));

      const querySnapshot = await getDocs(q);

      let dbGames: Array<Game> = [];
      querySnapshot.forEach((doc) => {
        const fields = doc.data()
        const dbGame: Game = {
          date: fields.date.toDate().toLocaleDateString() + ", " + fields.date.toDate().toLocaleTimeString(),
          difficulty: fields.difficulty,
          guessed: fields.guessed,
          user_id: fields.user_id,
          username: fields.username,
          id: doc.id
        };
        dbGames.push(dbGame);
      });
      games.value = dbGames;
    } catch (e) {
      error.value = "Error during loading history"
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  const insertGame = async (username: string, difficulty: string, correctAnswers: number) => {
    error.value = null
    try {
      const docRef = await addDoc(collection(firestore, "games"), {
        date: Timestamp.fromDate(new Date()),
        difficulty: difficulty,
        guessed: correctAnswers,
        user_id: auth.currentUser?.uid,
        username: username
      })
      console.log("Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding document: ", e)
      error.value = "Error during saving game"
      throw new Error(error.value)
    }
  }

  return {fetchLeaderboardGames, getGamesByUser, insertGame, isLoading, error, games}
})
