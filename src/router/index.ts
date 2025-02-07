import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import CountryList from '../views/CountryList.vue';
import CountryDetail from '../views/CountryDetail.vue';
import Login from "@/views/Login.vue";
import Registration from "@/views/Registration.vue";
import HomePage from "@/views/HomePage.vue";
import NotFound from "@/views/NotFound.vue";
import MyHistory from "@/views/MyHistory.vue";
import PlayScreen from "@/views/PlayScreen.vue";
import GameScreen from "@/views/GameScreen.vue";
import Leaderboard from "@/views/Leaderboard.vue";

import {auth} from "@/firebase";
import {useAuthStore} from "@/store/auth";
import {computed, ref, watch} from "vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: "/countries",
        component: CountryList,
        name: "CountryList",
        meta: { requiresAuth: false },
    },
    {
        path: "/country/:countryCode",
        component: CountryDetail,
        name: "CountryDetail",
        props: true,
        meta: { requiresAuth: false },
    },
    {
        path: "/login",
        component: Login,
        name: "Login",
        meta: { requiresAuth: false },
    },
    {
        path: "/registration",
        component: Registration,
        name: "Registration",
        meta: { requiresAuth: false },
    },
    {
        path: "/history",
        component: MyHistory,
        name: "MyHistory",
        meta: { requiresAuth: true },
    },
  {
    path: "/play",
    component: PlayScreen,
    name: "PlayScreen",
    meta: { requiresAuth: true }
  },
  {
    path: "/game",
    component: GameScreen,
    name: "GameScreen",
    meta: { requiresAuth: true },
    props: route => ({ gameMode: route.query.gameMode, difficulty: route.query.difficulty }),

  },
    {
        path: "/leaderboard",
        component: Leaderboard,
        name: "Leaderboard",
        meta: { requiresAuth: true }
    },



    { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound" }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const authStore = useAuthStore()
  const isAuthenticated = computed(()=>authStore.authenticated)

  if (requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
