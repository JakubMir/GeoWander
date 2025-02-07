/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import {createPinia} from "pinia";
import {loadFonts} from "@/plugins/webfontloader";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase";

loadFonts();
const app = createApp(App)

registerPlugins(app)
app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount('#app')
