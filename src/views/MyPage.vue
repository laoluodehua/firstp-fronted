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
          @focus="clearSelectedAmount"
          @blur="validateCustomAmount"
        />
        <div v-if="amountErrorMessage" class="error-message">
          {{ amountErrorMessage }}
        </div>
        <!-- 错误提示信息 -->
      </div>

      <h2>选择充值金额</h2>

      <div class="amount-container">
        <div
          class="amount-card"
          v-for="price in priceMapping"
          :key="price.price"
          @click="setPrice(price.price)"
          :class="{ active: selectedAmount === price.price }"
        >
          <div class="price">¥ {{ price.price }}</div>
        </div>
      </div>

      <div class="selected-amount">
        <h3>
          支付金额:
          {{ selectedAmount || customAmount }} &nbsp;&nbsp;&nbsp;&nbsp;元
        </h3>
      </div>

      <!-- 移动错误信息到这里 -->

      <button
        class="charge-button"
        @click="initiateCharge"
        :disabled="isCharging"
      >
        {{ isCharging ? "处理中..." : "立即支付" }}
      </button>
      <div class="error-message" v-if="paymentErrorMessage">
        {{ paymentErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
export default {
  name: "MyPage",
  data() {
    return {
      customAmount: null,
      selectedAmount: 0,
      amountErrorMessage: "", // 用于金额验证的错误信息
      paymentErrorMessage: "", // 用于支付失败的错误信息
      priceMapping: [
        { price: 300.0 },
        { price: 500.0 },
        { price: 1000 },
        { price: 2000.0 },
        { price: 3000.0 },
      ],
      isCharging: false, // 新增属性，用于禁用按钮
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
      this.customAmount = null // 重置自定义金额为 null，这样输入框恢复到默认占位符
      this.amountErrorMessage = "" // 清除金额错误信息
      this.paymentErrorMessage = "" // 清除支付错误信息
    },

    generateOrderId() {
      // 获取当前日期和时间
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0") // 月份从0开始，所以+1
      const day = String(now.getDate()).padStart(2, "0")
      const hour = String(now.getHours()).padStart(2, "0")
      const minute = String(now.getMinutes()).padStart(2, "0")
      const second = String(now.getSeconds()).padStart(2, "0")

      // 生成6位随机字母
      const randomLetters = Array(6)
        .fill(null)
        .map(() => {
          const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
          return letters.charAt(Math.floor(Math.random() * letters.length))
        })
        .join("")

      // 拼接日期时间和随机字母生成orderId
      const orderId = `${year}${month}${day}${hour}${minute}${second}${randomLetters}`
      return orderId
    },

    clearSelectedAmount() {
      this.selectedAmount = 0 // 清除固定金额的选中状态
      this.amountErrorMessage = "" // 清除金额错误信息
      this.paymentErrorMessage = "" // 清除支付错误信息
    },
    validateCustomAmount() {
      // 检查是否选择了固定金额
      if (this.selectedAmount) {
        return // 如果选择了固定金额，直接返回，不进行自定义金额的验证
      }

      const customAmountNumber = parseFloat(this.customAmount)

      // 检查金额是否为空或小于 300
      if (isNaN(customAmountNumber) || customAmountNumber < 300) {
        this.amountErrorMessage = "金额必须大于等于 300 元"
      } else {
        this.amountErrorMessage = "" // 清除错误信息
        this.selectedAmount = 0 // 确保自定义金额优先于选择金额
      }
      this.paymentErrorMessage = "" // 清除支付错误信息
    },
    async initiateCharge() {
      // 确保这里有 async 关键字
      this.validateCustomAmount()

      if (this.amountErrorMessage) {
        return
      }
      // 将 isCharging 设置为 true
      this.isCharging = true

      // 设置定时器，10秒后恢复按钮状态
      setTimeout(() => {
        this.isCharging = false
      }, 15000)

      const paymentData = {
        order_id: this.generateOrderId(),
        price: this.validAmount,
      }
      console.log(paymentData)
      this.isButtonDisabled = true // 禁用按钮

      try {
        const response = await axios.post(
          "/api/testapp/create_payment/",
          paymentData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const result = response.data // 获取返回的 JSON 数据
        console.log(result)
        if (result.success) {
          // 触发事件，传递 amount 和 order_id 给父组件
          this.$emit("payment-success", {
            amount: paymentData.price,
            orderId: paymentData.order_id,
          })
          console.log("111")
          // 这里设置 showQrCode 的值，确保只有在支付成功时才显示 QrCode 组件
          // this.showQrCode = true // 仅在支付成功后设置 showQrCode
          // this.$router.push({
          //   path: "/home/qrcode",
          //   query: { orderId: paymentData.order_id, amount: paymentData.price },
          // })
          // 延迟路由跳转，确保事件处理完毕
          // setTimeout(() => {
          //   this.$router.push("/home/qrcode")
          // }, 1000)
          // console.log("111")
        } else {
          // 如果支付没有成功，可以设置错误消息
          this.paymentErrorMessage = "支付失败，请重试"
        }
      } catch (error) {
        console.error(
          "支付失败:",
          error.response ? error.response.data : error.message
        )
        if (error.response && error.response.data) {
          // 根据 API 返回的具体错误信息设置错误提示
          this.paymentErrorMessage =
            error.response.data.message || "支付失败，请重试"
        } else {
          this.paymentErrorMessage = "支付失败，请重试"
        }
      } finally {
        // 在 finally 中确保无论如何都恢复按钮状态
        this.isCharging = false
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
  background-color: rgba(255, 255, 255, 0.8); /* 背景颜色透明，不影响内容 */
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

/* 当固定金额被选中时，保持背景颜色和文本颜色 */
.amount-card.active {
  background-color: green; /* 可以根据需要修改为你想要的颜色 */
  color: white;
  transform: scale(1.05); /* 点击后稍微放大，增加视觉反馈 */
}

/* 默认情况下的金额框样式 */
.amount-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s; /* 增加背景颜色的过渡效果 */
  width: 150px;
}

/* 鼠标悬停时的背景变化，但不影响选中状态 */
.amount-card:hover {
  background-color: #f41212; /* 鼠标悬停时的背景色 */
}

/* 避免在选中状态下鼠标悬停的颜色变化 */
.amount-card.active:hover {
  background-color: green; /* 确保选中时鼠标悬停也保持绿色 */
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
  color: red; /* 错误消息的颜色 */
  font-weight: bold; /* 加粗错误消息 */
  margin-left: 10px; /* 按钮和错误消息之间的间距 */
  display: inline; /* 确保是内联显示 */
}
</style>
