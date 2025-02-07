<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import Error from "@/components/Error.vue";
import {useAuthStore} from "@/store/auth";

const email = ref<string>("")
const password = ref<string>("")
const incorrectLogin = ref<boolean>(false)
const error = ref<ErrorEvent | null>(null)

const router = useRouter();

const authStore = useAuthStore()

const loginUser = async () => {
  try {
    await authStore.loginUser(email.value, password.value)
  } catch (error: any) {
    console.error('Error signing in:', error);
    incorrectLogin.value = true
    error.value = error
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row align="center" justify="center">
      <v-col cols="12" md="10">
        <Error v-if="incorrectLogin " :message="'Your email or password was incorrect.'"/>
        <v-card class="pa-8" max-width="2000">
          <v-row>
            <v-col cols="12" md="6">
              <v-container class="d-flex justify-center align-center">
                <v-img aspect-ratio="16/9" src="src/assets/undraw_Login_re_4vu2.png"></v-img>
              </v-container>
            </v-col>
            <v-col cols="12" md="6">
              <h2 class="text-center" style="text-align: center">Log in</h2>
              <v-form>
                <v-label>E-mail:</v-label>
                <v-text-field id="LoginEmail" v-model="email" variant="outlined"></v-text-field>

                <v-label>Password:</v-label>
                <v-text-field id="LoginPassword" v-model="password" type="password" variant="outlined"></v-text-field>

              </v-form>
              <p class="pt-2 pb-5 text-center">
                Don't have an account yet?
                <router-link :to="{ name: 'Registration' }">Sign up</router-link>
              </p>
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn id="LoginButton" :disabled="!email || !password" @click="loginUser">Log in</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
