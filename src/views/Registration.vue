<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row align="start" justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-5">
          <h2 class="mt-6 text-center">Registration</h2>
          <Error v-if="showUsernameExistsAlert || showEmailExistsAlert" :message="errorMessage"/>
          <Error v-if="showPasswordMismatchAlert " :message="'Passwords do not match.'"/>
          <Error v-if="passwordTooShortAlert " :message="'Password has to be at least 6 characters long.'"/>
          <v-form>
            <v-label>Email:</v-label>
            <v-text-field id="RegistrationEmail" v-model="user.email" variant="outlined"></v-text-field>

            <v-label>Username:</v-label>
            <v-text-field id="RegistrationUsername" v-model="user.username" variant="outlined"></v-text-field>

            <v-label>Password:</v-label>
            <v-text-field id="RegistrationPassword" v-model="user.password" type="password"
                          variant="outlined"></v-text-field>
            <v-label>Repeat the password:</v-label>
            <v-text-field id="RegistrationPasswordAgain" v-model="passwordAgain" type="password"
                          variant="outlined"></v-text-field>
          </v-form>
          <p class="pt-2 pb-5 text-center">
            Already have an account?
            <router-link :to="{ name: 'Login' }">Login here.</router-link>
          </p>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn id="RegistrationButton" :disabled="!user.email || !user.username || !user.password || !passwordAgain || showPasswordMismatchAlert "
                     @click="registerUser">
                Sign up
              </v-btn>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {collection, addDoc, getDocs, query, where, setDoc, doc} from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, Auth, onAuthStateChanged, signOut} from 'firebase/auth';
import {firestore} from '@/firebase';
import AppBar from "@/components/AppBar.vue";
import Error from "@/components/Error.vue";
import router from "@/router";
import {User} from "@/model/User";
import {useAuthStore} from "@/store/auth";

let user = ref({
  email: '',
  username: '',
  password: ''
});

const authStore = useAuthStore()

const passwordAgain = ref('');
const errorMessage = ref('');
const showUsernameExistsAlert = ref(false);
const showEmailExistsAlert = ref(false);

const showPasswordMismatchAlert = computed(() => {
  return user.value.password && passwordAgain.value && user.value.password !== passwordAgain.value;
});

const passwordTooShortAlert = computed(() => {
  return user.value.password && passwordAgain.value && user.value.password.length < 6 && passwordAgain.value.length < 6;
});

const registerUser = async () => {
  try {
    const usernameExists = await checkUsernameExists(user.value.username.trim());
    if (usernameExists) {
      showUsernameExistsAlert.value = true;
      errorMessage.value = 'Username already exists.';
      return;
    }

    const emailExists = await checkEmailExists(user.value.email.trim());
    if (emailExists) {
      showEmailExistsAlert.value = true;
      errorMessage.value = 'Email already exists.';
      return;
    }


    const auth = getAuth();


    try {
      /*const userCredential = await createUserWithEmailAndPassword(auth, user.value.email, user.value.password);
      const firebaseUser = userCredential.user;*/

      await authStore.registerUser(user.value.email, user.value.username, user.value.password/*, firebaseUser.uid*/)
      console.log(auth.currentUser)
      console.log("uname " + user.value.username + " has been registered.");
    } catch (err) {

    }


    router.push({name: 'Home'})
  } catch (error) {
    console.error('Error registering user:', error);
    errorMessage.value = 'Error registering user.';
  }
};

async function checkUsernameExists(username: string): Promise<boolean> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

async function checkEmailExists(email: string): Promise<boolean> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

</script>
