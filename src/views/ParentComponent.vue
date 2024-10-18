<template>
  <div class="parent-container">
    <MyPage v-if="!showQrCode" @payment-success="handlePaymentSuccess" />

    <!-- 将 amount 和 order_id 传递给 QrCode 子组件 -->
    <QrCode
      v-if="showQrCode"
      :amount="amount"
      :order-id="orderId"
      @back-to-payment="goBackToPayment"
    />
    <!-- <QrCode v-if="amount && orderId" :amount="amount" :order-id="orderId" /> -->
  </div>
</template>

<script>
import MyPage from "./MyPage.vue"
import QrCode from "./QrCode.vue"

export default {
  components: {
    MyPage,
    QrCode,
  },
  data() {
    return {
      showQrCode: false,
      amount: null,
      orderId: null,
    }
  },
  methods: {
    handlePaymentSuccess({ amount, orderId }) {
      // 接收来自 MyPage 的金额和订单号，并保存到父组件的状态中
      console.log("Received payment data:", { amount, orderId })

      this.amount = amount
      this.orderId = orderId
      this.showQrCode = true
    },
    goBackToPayment() {
      this.showQrCode = false // 返回到支付页面
    },
  },
  // created() {
  //   // 从路由 query 中提取参数
  //   this.orderId = this.$route.query.orderId
  //   this.amount = this.$route.query.amount

  //   // 确保提取到的参数有效
  //   if (!this.orderId) {
  //     console.error("Missing orderId in route query")
  //   }
  // },
}
</script>
