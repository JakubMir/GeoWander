<script lang="ts" setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useAuthStore} from "@/store/auth";

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.authenticated)
const drawer = ref(false);
const isDesktop = ref(window.innerWidth >= 960);

const logout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 960;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <v-app-bar app density="compact" elevation="0">
    <v-container class="d-flex align-center">
      <template v-if="isDesktop">
        <v-app-bar-nav-icon :style="{ visibility: 'hidden'}"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn id="navMainButton" :to="{ name: 'Home' }">Home</v-btn>
        <v-btn id="navPlayButton" :to="{ name: 'PlayScreen' }">Play</v-btn>
        <v-btn id="navLeaderboardButton" :to="{ name: 'Leaderboard' }">Leaderboard</v-btn>
        <v-btn id="navCountryListButton" :to="{ name: 'CountryList' }">Country list</v-btn>
        <v-btn id="navMyHistoryButton" :to="{ name: 'MyHistory' }">My history</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="!isAuthenticated" id="navLogin" :active="false" :ripple="false" :to="{ name: 'Login' }" icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <v-btn v-else id="navLogout" :active="false" :ripple="false" icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>


      <template v-else>
        <v-spacer></v-spacer>
        <v-btn id="navMenuButton" icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" :class="{ 'text-center fill-height w-100' : drawer }" app location="right"
                       temporary>
    <v-list>
      <v-list-item :to="{ name: 'Home' }">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'PlayScreen' }">
        <v-list-item-title>Play</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'Leaderboard' }">
        <v-list-item-title>Leaderboard</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'CountryList' }">
        <v-list-item-title>Country List</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'MyHistory' }">
        <v-list-item-title>My History</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-if="!isAuthenticated" :to="{ name: 'Login' }">
        <v-list-item-title>Login</v-list-item-title>
      </v-list-item>
      <v-list-item v-else @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
