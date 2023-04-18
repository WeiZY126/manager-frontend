import './plugins/axios'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {axiosGet, axiosPost,axiosPostWithStringify, axiosDelete} from "./plugins/request.js"
import Element from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App).use(store).use(router).use(Element)

app.config.globalProperties.$axiosGet = axiosGet;
app.config.globalProperties.$axiosPost = axiosPost;
app.config.globalProperties.$axiosDelete = axiosDelete;
app.config.globalProperties.$axiosPostWithStringify = axiosPostWithStringify;
app.config.globalProperties.$routeIns = router;

app.config.productionTip = false

app.mount('#app')