import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue" // 导入Home组件
import About from "../views/About.vue" // 导入About组件
import MyPage from "../views/MyPage.vue" // 导入MyPage组件
import QrCode from "../views/QrCode.vue" // 替换为实际路径

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/home/pay", // 新增的路由路径
    name: "MyPage",
    component: MyPage, // 使用MyPage组件
  },
  {
    path: "/", // 默认路由
    redirect: "/home", // 重定向到/home
  },
  {
    path: "/home/qrcode", // 默认路由
    name: "QrCode",
    component: QrCode, // 使用MyPage组件
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
