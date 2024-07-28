import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入ElementUI-Plus
import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'
// 引入pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import "./assets/global.css"

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(ElementPlus)
app.use(pinia)

app.mount('#app')
