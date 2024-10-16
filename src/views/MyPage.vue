<template>
  <div class="background-container">
    <!-- 新增的背景容器 -->
    <div class="my-page">
      <h1>自定义金额</h1>

      <div class="amount-input">
        <input
          type="number"
          v-model="customAmount"
          placeholder="请输入自定义金额"
          @input="updateSelectedAmount"
          @blur="validateCustomAmount"
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <!-- 错误提示信息 -->
      </div>

      <h2>选择充值金额</h2>

      <div class="amount-container">
        <div
          class="amount-card"
          v-for="price in priceMapping"
          :key="price.price"
          @click="setPrice(price.price)"
        >
          <div class="price">¥ {{ price.price }}</div>
        </div>
      </div>

      <div class="selected-amount">
        <h3>
          应付金额:
          {{ selectedAmount || customAmount }} &nbsp;&nbsp;&nbsp;&nbsp;元
        </h3>
      </div>

      <button class="charge-button" @click="initiateCharge">立即支付</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPage",
  data() {
    return {
      customAmount: null,
      selectedAmount: 0,
      errorMessage: "", // 确保 errorMessage 在 data 中初始化
      priceMapping: [
        { price: 300.0 },
        { price: 500.0 },
        { price: 1000 },
        { price: 2000.0 },
        { price: 3000.0 },
      ],
    }
  },
  computed: {
    validAmount() {
      // 如果 selectedAmount 存在则使用 selectedAmount 否则使用 customAmount
      const amount = this.selectedAmount || parseFloat(this.customAmount)
      return amount > 0 ? amount : null
    },
  },
  methods: {
    setPrice(price) {
      this.selectedAmount = price
      this.errorMessage = "" // 清除错误信息
    },
    validateCustomAmount() {
      const customAmountNumber = parseFloat(this.customAmount)

      // 检查金额是否为空或小于 300
      if (isNaN(customAmountNumber) || customAmountNumber < 300) {
        this.errorMessage = "金额必须大于等于 300 元"
      } else {
        this.errorMessage = "" // 清除错误信息
        this.selectedAmount = 0 // 确保自定义金额优先于选择金额
      }
    },
    async initiateCharge() {
      // 确保这里有 async 关键字
      this.validateCustomAmount()

      if (this.errorMessage) {
        return
      }

      const paymentData = {
        amount: this.validAmount,
      }

      try {
        const response = await fetch("/api/pay", {
          // 在 async 函数中可以使用 await
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        if (!response.ok) {
          throw new Error("网络错误，无法处理支付请求")
        }

        const result = await response.json()
        console.log(result)
      } catch (error) {
        console.error("支付失败:", error)
        this.errorMessage = "支付失败，请重试"
      }
    },
  },
}
</script>

<style scoped>
/* 样式保持不变 */
.background-container {
  background-image: url("@/assets/images/background.png"); /* 固定物理地址 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */
  height: calc(100vh - 100px); /* 设置容器高度为视口高度 */
  display: flex;
  justify-content: center; /* 居中内容 */
  align-items: center; /* 垂直居中内容 */
  overflow: hidden; /* 隐藏滚动条 */
  opacity: 0.8; /* 可选：添加透明度使内容更易于阅读 */
}

.my-page {
  text-align: center;
  padding: 20px; /* 使用内边距 */
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%; /* 限制最大宽度 */
  overflow: hidden; /* 防止内容溢出 */
}

.amount-input {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.amount-input input {
  padding: 10px;
  width: 250px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
  text-align: center; /* 添加这行代码以居中输入框内容 */
}

.amount-input input:focus {
  border-color: #ff5722;
  box-shadow: 0 0 5px rgba(255, 87, 34, 0.5);
}

.amount-input input::placeholder {
  color: #999;
  font-style: italic;
}

.amount-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.amount-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s; /* 增加背景颜色的过渡效果 */
  width: 150px;
}

.amount-card:hover {
  transform: scale(1.05);
  background-color: red; /* 鼠标悬停时背景变为绿色 */
  color: white; /* 可选：悬停时文字变为白色，便于阅读 */
}

.price {
  font-size: 18px;
  font-weight: bold;
}

.selected-amount {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.charge-button {
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background-color: #ddd; /* 默认的淡色背景 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out; /* 平滑的过渡效果 */
}

/* 鼠标悬停时的样式 */
.charge-button:hover {
  background-color: green; /* 鼠标悬停时背景变成绿色 */
  transform: scale(1.05); /* 鼠标悬停时稍微放大 */
}

/* 鼠标按下时的样式 */
.charge-button:active {
  transform: scale(1.1); /* 鼠标按下时放大一些 */
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
