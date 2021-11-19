<template>
  <a-card :bordered="true">
    <div class="content" v-if="1 == 1">
      <img class="img" :src="require('@/assets/images/custom/success@1x.png')" alt />
      <h3>支付成功</h3>
      <p></p>
      <p>您已成功支付{{ realMoney | formatCurrency(2, true) }}元</p>
      <ul class="Collection">
        <li>
          <p>收款单位:</p>
          <p>{{ payeeName }}</p>
        </li>
        <li>
          <p class="span1">付款金额:</p>
          <p class="span2">{{ realMoney | formatCurrency(2, true) }}元</p>
        </li>
        <li>
          <p class="span1">支付方式:</p>
          <p class="span2">{{ paymentMethod }}</p>
        </li>
        <li>
          <p class="span1">交易类型:</p>
          <p class="span2">{{ sceneType }}</p>
        </li>
        <li>
          <p class="span1">订单编号:</p>
          <p class="span2">{{ orderCode }}</p>
        </li>
        <li class="li">
          <span>{{ count }}秒</span>后返回
          <span class="go" @click="to">立即跳转</span>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script>
// 传递的值 付款金额 交易类型 订单编号
export default {
  data() {
    return {
      count: 0,
      clean: null,
      orderCode: '',
      realMoney: '',
      sceneType: '',
      payeeName: '',
      objType: {
        1: '套餐费',
        11: '寻源保证金',
        13: '标书费',
        14: '寻源保证金退还',
        8: '充值',
        81: '提现'
      }
    }
  },
  created() {
    console.log(this.$route.params)
  },
  mounted() {
    //  sceneType     1套餐费 11寻源保证金 12标书费 13平台保证金 14寻源保证金退还 8充值 81提现 //收银台以外传入
    this.orderCode = this.$route.params.orderCode
    this.realMoney = this.$route.params.realMoney
    this.sceneType = this.$route.params.sceneType === '投标保证金' ? '寻源保证金' : this.$route.params.sceneType
    this.sceneType === '投标保证金退还' ? (this.sceneType = '寻源保证金退还') : (this.sceneType = this.sceneType)
    this.payeeName = this.$route.params.payeeName
    this.paymentMethod = this.$route.params.paymentMethod
    this.countDown()
  },
  methods: {
    to() {
      if (this.$hasOpeerate()) {
        this.$router.push({ name: 'SysOperatorsHome' })
      } else {
        this.$router.push({ name: 'FinanceHome' })
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
    }
  },
  beforeDestroy() {
    clearInterval(this.clean)
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
  h3 {
    font-family: PingFangSC-Medium;
    font-size: 26px;
    color: #333333;
    letter-spacing: 0;
    line-height: 26px;
    font-weight: bold;
  }
  & > :nth-of-type(2) {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    line-height: 26px;
    margin-left: -25px;
  }
  .Collection {
    display: inline-block;
    li {
      height: 28px;
      display: flex;
      text-align: center;
      & > :nth-of-type(1) {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #555555;
        letter-spacing: 0;
        text-align: center;
      }
      & > :nth-of-type(2) {
        margin-left: 8px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        font-weight: 600;
      }
    }
  }
  .li {
    margin-top: 16px;
    font-size: 16px;
    color: #2a2a2a;
    font-weight: 500;
    line-height: 16px;
    & > :nth-of-type(1) {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ff6b00 !important;
      letter-spacing: 0;
      text-align: center;
      line-height: 16px;
    }
    & > :nth-of-type(2) {
      margin-left: 10.7px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ff6b00 !important;
      letter-spacing: 0;
      text-align: center;
      line-height: 16px;
      text-decoration: underline;
      font-weight: normal !important;
    }
  }
}
.go {
  cursor: pointer;
}
</style>
