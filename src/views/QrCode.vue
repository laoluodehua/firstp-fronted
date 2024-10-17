<template>
  <div class="background-container">
    <div class="content">
      <h1 class="title">请扫码</h1>
      <!-- 始终显示标题 -->
      <img
        :src="qrCodeUrl"
        alt="图片"
        class="qr-code-image"
        @error="handleImageError"
      />
      <p v-if="imageLoadError" class="error-message">二维码加载失败</p>
      <!-- 加载失败时显示提示 -->

      <!-- 添加返回支付页面的按钮 -->
      <button class="back-button" @click="goBack">返回支付页面</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 替换为您二维码的真实 URL
      qrCodeUrl: "/public/images/20241017181147yHpclW.png",
      imageLoadError: false, // 追踪图片加载错误的状态
    }
  },
  methods: {
    handleImageError() {
      this.imageLoadError = true // 设置图片加载错误状态
    },
    goBack() {
      // 返回支付页面的逻辑
      this.$router.push({ name: "MyPage" }) // 假设支付页面的路由名称为 PaymentPage
    },
  },
}
</script>

<style scoped>
.background-container {
  background-image: url("@/assets/images/background.png"); /* 固定物理地址，需替换为真实路径 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */
  height: calc(100vh); /* 设置容器高度为视口高度 */
  display: flex;
  justify-content: center; /* 居中内容 */
  align-items: center; /* 垂直居中内容 */
  overflow: hidden; /* 隐藏滚动条 */
  opacity: 0.8; /* 可选：添加透明度使内容更易于阅读 */
  background-color: rgba(255, 255, 255, 0.8); /* 背景颜色透明，不影响内容 */
}

.content {
  text-align: center;
  width: 700px; /* 设置固定宽度 */
  height: 700px; /* 设置固定高度 */
  padding: 20px; /* 调整内边距 */
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%; /* 限制最大宽度 */
  overflow: hidden; /* 防止内容溢出 */
}

.title {
  margin-bottom: 20px; /* 增加底部外边距以留出空间 */
  margin-top: 100px; /* 从10px减少到5px，向上移动一点 */
  color: #333; /* 标题文字颜色 */
}

.qr-code-image {
  width: 400px; /* 根据需要调整二维码的大小 */
  height: 400px; /* 根据需要调整二维码的大小 */
  object-fit: contain; /* 确保图像适应框并保持比例 */
  min-width: 200px; /* 设置最小宽度 */
  min-height: 200px; /* 设置最小高度 */
  display: block;
  margin: 0 auto;
}

.error-message {
  color: red; /* 设置错误信息的颜色 */
  margin-top: 10px; /* 为错误信息设置顶部外边距 */
}

.back-button {
  margin-top: 20px; /* 为按钮设置顶部外边距 */
  padding: 10px 20px; /* 设置按钮的内边距 */
  font-size: 16px; /* 设置按钮字体大小 */
  color: white; /* 设置按钮文字颜色 */
  background-color: #007bff; /* 设置按钮背景颜色 */
  border: none; /* 去掉边框 */
  border-radius: 5px; /* 设置圆角 */
  cursor: pointer; /* 设置鼠标指针为手型 */
  transition: background-color 0.3s; /* 添加过渡效果 */
}

.back-button:hover {
  background-color: #0056b3; /* 设置悬停时的背景颜色 */
}
</style>
