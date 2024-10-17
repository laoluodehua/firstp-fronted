import { createApp } from "vue"
import App from "./App.vue"
import router from "./router" // 引入路由配置
import axios from "axios" // 引入 Axios

// 设置 Axios 的默认基础 URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

createApp(App)
  .use(router) // 使用路由
  .mount("#app")
