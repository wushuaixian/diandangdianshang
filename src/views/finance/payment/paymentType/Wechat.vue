<template>
  <div class="defrayalPage">
    <header>
      <div class="df_ac mt20">
        <span>支付剩余时间</span>
        <span class="time" style="color: rgb(248, 105, 49)"> &ensp; {{ minute }}分{{ second }}秒</span>
      </div>
      <div class="df_ac mt20" style="color: rgb(248, 105, 49)">
        <span class="buckTag">￥</span><span class="money">{{ realMoney }}</span>
      </div>
      <div class="m_auto mt20 WechatType ac">
        <div class="df_ac">
          <p style="line-height: 30px">
            <img style="width: 30px" src="@/assets/images/custom/wechat.png" alt="" />
          </p>
          <p class="ml10">微信支付</p>
        </div>
      </div>
    </header>
    <main class="mt40">
      <div class="m_auto defrayalImg">
        <img class="m_auto df" :src="iconUrl" alt="" />
        <div class="mt20"><p class="df_ac">打开微信扫一扫付款</p></div>
      </div>
      <div class="df_ac mt30">若支付失败，<a @click="renovateDefrayal">点击此处</a>刷新二维码后重试</div>
    </main>
    <footer class="mt20">
      <div class="df_sp mt40">
        <p class="but ac" style="color: rgb(44, 122, 223)" @click="gotoHome">支付遇到问题</p>
        <p class="but ac" style="background: rgb(44, 122, 223); color: white" @click="gotoHome">已成功支付</p>
      </div>
    </footer>
    <template> </template>
  </div>
</template>
<script>
import { orderDefraya } from '@/api/defrayalApi'
import { generateQR } from '@/utils/qrcode'
import { decodeQrCode } from '@/utils/encrypt'
import { getResult } from '@/api/fince'

export default {
  data() {
    return {
      minutes: 15,
      seconds: 0,
      realMoney: '0',
      orderCode: '',
      iconUrl: '',
      sceneType: '',
      status: null
    }
  },
  computed: {
    second() {
      return this.num(this.seconds)
    },
    minute() {
      return this.num(this.minutes)
    }
  },
  created() {
    // 接收参数
    this.iconUrl = this.$route.params.iconUrl
    this.realMoney = this.$route.params.realMoney
    this.sceneType = this.$route.params.sceneType
    this.orderCode = this.$route.params.orderCode
  },
  mounted() {
    this.add()
    this.getResult()
  },
  methods: {
    // 刷新二维码
    async renovateDefrayal() {
      const params = {
        orderCode: this.orderCode,
        frontUrl: 'http://www.baidu.com'
      }
      const res = await orderDefraya(params)
      if (res.code === '0') {
        const url = decodeQrCode(res.data)
        const ss = generateQR(url)
        ss.then((res) => {
          this.iconUrl = res
        })
      }
    },
    // 支付成功跳转首页
    gotoHome() {
      if (this.sceneType === '1' || this.sceneType === '11' || this.sceneType === '12' || this.sceneType === '13') {
        this.$router.push({ name: 'SysOperatorsHome' })
      } else {
        this.$router.push({ name: 'SuppliersPaymentManage' })
      }
    },
    // 选择其它支付方式
    updatedefrayaType() {},
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
        } else {
          _this.seconds -= 1
        }
      }, 1000)
    },
    // 获取支付状态
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
  beforeDestroy() {
    clearInterval(this.status)
  },
  watch: {
    second: {
      handler(newVal) {
        this.num(newVal)
      }
    },
    minute: {
      handler(newVal) {
        this.num(newVal)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.defrayalPage {
  font-size: 20px;
  position: relative;
  max-width: 52%;
  margin: auto;
}
header {
  .money {
    font-size: 32px;
    font-weight: bold;
  }
  .buckTag {
    height: 20px;
  }
  .WechatType {
    width: 270px;
    border: 2px solid #6797d2;
    height: 45px;
    line-height: 40px;
  }
  .time {
    color: red;
  }
}
main {
  .defrayalImg {
    padding: 20px;
    width: 300px;
    height: 320px;
    background: #16775408;
    img {
      width: 250px;
      height: 250px;
    }
  }
}
footer {
  .but {
    width: 200px;
    height: 50px;
    line-height: 50px;
    border-radius: 8px;
    border: 1px solid rgb(189, 189, 189);
    cursor: pointer;
  }
}
.ac {
  text-align: center;
}
.m_auto {
  margin: 0 auto;
}
.mt30 {
  margin-top: 30px;
}
.mt40 {
  margin-top: 40px;
}
.mt20 {
  margin-top: 10px;
}
.df_ac {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ml10 {
  margin-left: 10px;
}
.df_sp {
  display: flex;
  justify-content: space-evenly;
}
.df {
  display: flex;
}
a {
  color: #6797d2;
}
a:hover {
  color: #6797d2;
}
</style>

// sceneType     1套餐费 11寻源保证金 12标书费 13平台保证金  //付款管理

                  8充值 81提现 |  //叮当账户
