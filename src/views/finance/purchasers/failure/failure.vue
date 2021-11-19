<template>
  <a-card :bordered="true">
    <div class="content" v-if="1 == 1">
      <img class="img" :src="require('@/assets/images/custom/zhifushibai@2x.png')" alt />
      <p>支付失败</p>
      <p>{{ errorMsg }}</p>
      <p>
        <span class="span1">交易类型:</span>
        <span class="span2">{{ sceneType }}</span>
      </p>
      <div class="Collection">
        <span>5秒</span>后返回
        <span>
          <a href="#" @click="continuePay">继续支付</a>
        </span>
      </div>
    </div>
    <div class="content" v-if="1 == 2">
      <img class="img" :src="require('@/assets/images/custom/zhifushibai@2x.png')" alt />
      <p>支付超时</p>
      <p>支付失败原因</p>
      <p>
        <span class="span1">交易类型:</span>
        <span class="span2">套餐费</span>
      </p>
      <div class="Collection">
        <span>{{ count }}秒</span>后返回
        <span>继续支付</span>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      orderCode: '',
      realMoney: '',
      sceneType: '',
      paymentMethod: '',
      payeeName: '',
      errorMsg: ''
    }
  },
  mounted() {
    this.sceneType = this.$route.params.sceneType === '投标保证金' ? '寻源保证金' : this.$route.params.sceneType
    this.sceneType === '投标保证金退还' ? (this.sceneType = '寻源保证金退还') : (this.sceneType = this.sceneType)
    this.paymentMethod = this.$route.params.paymentMethod
    this.errorMsg = this.$router.params.errorMsg
  },
  methods: {
    to() {
      if (this.$hasOpeerate()) {
        this.$router.push({ name: 'SysOperatorsHome' })
      } else {
        this.$router.push({ name: 'financeHome' })
      }
    },
    countDown() {
      this.count = 10
      this.clean = setInterval(() => {
        this.count--
        if (this.count <= 0) {
          clearInterval(this.clean)
          this.to()
        }
      }, 1000)
    },
    continuePay() {
      this.$router.push({
        name: 'FinancePaymentCashier',
        params: {
          ...JSON.parse(this.$route.params.cashierParams)
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.ant-card {
  background: #f0f2f5;
  border: none;
}
.content {
  width: 1000px;
  height: 666px;
  background: #ffffff;
  border-radius: 8px;
  margin: 0 auto;
  text-align: center;
  .img {
    margin-top: 30px;
    width: 280px;
    height: 280px;
  }
  & > :nth-of-type(1) {
    font-family: PingFangSC-Medium;
    font-size: 26px;
    color: #333333;
    letter-spacing: 0;
    line-height: 26px;
    font-weight: 700;
  }
  & > :nth-of-type(2) {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    line-height: 26px;
  }
  & > :nth-of-type(3) {
    .span1 {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #555555;
      letter-spacing: 0;
      text-align: center;
    }
    .span2 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      margin-left: 8px;
      font-weight: 600;
    }
  }
  .Collection {
    font-size: 16px;
    color: #2a2a2a;
    font-weight: 500;
    & > :nth-of-type(1) {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ff6b00;
      letter-spacing: 0;
      text-align: center;
      line-height: 16px;
    }
    & > :nth-of-type(2) {
      margin-left: 10.7px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      // color: #000000;
      letter-spacing: 0;
      text-align: center;
      line-height: 16px;
      text-decoration: underline;
    }
  }
}
</style>
