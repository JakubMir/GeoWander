import {defineStore} from "pinia"
import {computed, onBeforeMount, ref} from "vue"
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "firebase/auth"
import {auth, firestore} from "@/firebase"
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore"
import {User} from "@/model/User"
import router from "@/router"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const authenticated = computed(() => user.value !== null)

  // update user value on auth state change
  onBeforeMount(async () => {
    user.value = await new Promise((resolve: any, reject: any) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          resolve({id: user.uid, username: await getUsername()})
        } else {
          resolve(null)
        }
      }, (e) => reject(e))
    })
  })


  async function getUsername() {
    try {
      let q = query(collection(firestore, "users"), where("uid", "==", auth.currentUser?.uid))
      let username = ''
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const fields = Object.assign(doc.data())
        user.value = {
          id: doc.id, username: fields.username
        }
        username = fields.username
      })
      return username
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? "Unknown error")
    }

  }

  async function loginUser(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      await router.push({name: 'Home'})
    } catch (error: any) {
      console.error('Error signing in:', error)
      throw new Error(error.response?.data?.message ?? "Unknown error")
    }
  }

  async function registerUser(email: string, username: string, password: string) {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      const userDocRef = doc(firestore, `users/${uid}`)
      await setDoc(userDocRef, {
        email: email, username: username, password: password, uid: uid, lastLogin: new Date()
      })
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('Error signing up:', error)
      throw new Error(error.response?.data?.message ?? "Unknown error")
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      await router.push({name: 'Login'})
      return {error: null}
    } catch (error: any) {
      console.error('Error signing out:', error)
      throw new Error(error.response?.data?.message ?? "Unknown error")
    }
  }

  return {loginUser, registerUser, logout, getUsername, user, authenticated}
})
