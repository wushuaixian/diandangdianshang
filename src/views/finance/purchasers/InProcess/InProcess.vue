<template>
  <a-card :bordered="true">
    <div class="content" v-if="1 == 1">
      <img class="img" :src="require('@/assets/images/custom/awit.png')" alt />
      <h3>支付处理中</h3>
      <p></p>
      <ul class="Collection">
        <li>
          <p>收款单位:</p>
          <p>叮当(天津)电子商务有限公司</p>
        </li>
        <li>
          <p class="span1">付款金额:</p>
          <p class="span2">{{ (paymentBalance || 0) | formatCurrency(2, true) }}元</p>
        </li>
        <li>
          <p class="span1">支付方式:</p>
          <p class="span2">网银</p>
          <!-- </li>
        <li>
          <p class="span1">交易类型:</p>
          <p class="span2">套餐费</p>
        </li> -->
        </li>

        <li>
          <p class="span1">订单编号:</p>
          <p class="span2">{{ orderCode }}</p>
        </li>
        <li class="li">
          <span>{{ minute }}分{{ second }}秒</span>后返回
          <span class="hand" @click="home">立即跳转</span>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script>
import { getResult } from '@/api/fince'
export default {
  data() {
    return {
      countDown: 10,
      clean: null,
      orderCode: '',
      paymentBalance: '',
      status: null,
      minutes: 15,
      seconds: 0
    }
  },
  mounted() {
    this.orderCode = this.$route.params.orderCode
    this.paymentBalance = this.$route.params.realMoney
    this.sceneType = this.$route.params.sceneType
    this.getResult()
    // this.clean = setInterval(() => {
    //   this.countDown--
    //   console.log(this.countDown)
    //   if (this.countDown <= 0) {
    //     clearInterval(this.clean)
    //     this.countDown = 0
    //     this.$router.push({ name: 'FinanceHome' })
    //   }
    // }, 1000)
    this.add()
  },
  computed: {
    second() {
      return this.num(this.seconds)
    },
    minute() {
      return this.num(this.minutes)
    }
  },
  methods: {
    home() {
      if (this.$hasOpeerate()) {
        this.$router.push({ name: 'SysOperatorsHome' })
      } else {
        this.$router.push({ name: 'FinanceHome' })
      }
    },
    num(n) {
      return n < 10 ? '0' + n : '' + n
    },
    add() {
      const _this = this
      const time = window.setInterval(function () {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59
          _this.minutes -= 1
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          _this.seconds = 0
          window.clearInterval(time)
          _this.home()
        } else {
          _this.seconds -= 1
        }
      }, 1000)
    },
    getResult() {
      this.status = setInterval(() => {
        getResult({ orderCode: this.orderCode, sceneType: this.sceneType }).then((res) => {
          if (res.code === '0') {
            if (res.data.payResult === 3) {
              clearInterval(this.status)
              this.$router.push({
                name: 'paymentSuccessful',
                params: {
                  orderCode: res.data.orderCode,
                  realMoney: res.data.paymentAmount,
                  sceneType: res.data.sceneType,
                  payeeName: res.data.payeeName,
                  paymentMethod: res.data.paymentMethod
                }
              })
            } else if (res.data.payResult > 3) {
              clearInterval(this.status)
              this.$router.push({
                name: 'paymentFaile',
                params: {
                  errorMsg: res.data.errorMsg,
                  sceneType: res.data.sceneType,
                  cashierParams: this.$route.params.cashierParams
                }
              })
            }
          }
        })
      }, 2000)
    }
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  beforeDestroy() {
    clearInterval(this.status)
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
.hand {
  cursor: pointer;
}
</style>
