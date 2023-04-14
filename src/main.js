import './plugins/axios'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {axiosGet, axiosPost, axiosDelete} from "./plugins/request.js"

const app = createApp(App).use(store).use(router).mount('#app')

app.config.globalProperties.$axiosGet = axiosGet;
app.config.globalProperties.$axiosPost = axiosPost;
app.config.globalProperties.$axiosDelete = axiosDelete;

// app.config.productionTip = false
