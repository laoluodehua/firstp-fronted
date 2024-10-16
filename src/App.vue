<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/home">首页</router-link>
      <router-link to="/about">关于我们</router-link> -->
      <!-- <router-link to="/home/pay">我的页面</router-link> -->
      <!-- 新增的链接 -->
    </nav>
    <router-view />
    <!-- 这里渲染路由匹配的组件 -->
  </div>
</template>

<script>
export default {
  name: "App",
}
</script>

<style>
/* 在这里添加一些全局样式，例如导航的样式 */
nav {
  margin-bottom: 20px; /* 添加导航与内容之间的间距 */
}
nav a {
  margin-right: 15px; /* 添加导航链接之间的间距 */
  text-decoration: none; /* 移除下划线 */
  color: #333; /* 设置链接颜色 */
}
nav a.router-link-exact-active {
  font-weight: bold; /* 高亮当前活动链接 */
}
</style>
