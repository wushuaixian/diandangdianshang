<template>
  <div class="cashier">
    <div class="title">
      <div>
        <a-icon type="check-circle" class="icon" />
        <span>订单编号: {{ orderCode }}, 请您尽快付款~</span>
      </div>
      <div class="payment">
        <span>付款金额:{{ paymentBalance | formatCurrency(2, true) }}</span> 元
      </div>
    </div>
    <div class="context">
      <div class="titleText">请选择支付方式</div>
      <div v-for="(item, index) in showStatus" :key="index">
        <div class="paymentType" v-if="item.paymentMethod == 1">
          <a-checkbox v-model="type.onlineBanking" @change="change(item.paymentMethod, 'onlineBanking')">
            <img src="@/assets/images/custom/wangyin.png" class="imgsize" alt />
            <span class="fontWeight">网银支付</span>
          </a-checkbox>
          <span class="paymentType_right">
            支付
            <span>{{ combineType ? realBalance : paymentBalance | formatCurrency(2, true) }}</span
            >元
          </span>
        </div>
        <div class="paymentType" v-if="item.paymentMethod == 2">
          <a-checkbox
            :disabled="money > 0 ? false : true"
            v-model="type.balance"
            @change="change(item.paymentMethod, 'balance')"
          >
            <img src="@/assets/images/custom/balance.png" class="imgsize" alt />
            <span class="fontWeight">余额支付</span>
          </a-checkbox>
          <span class="paymentType_central" v-if="item.paymentMethod == 2 && isCombine">
            (可用余额
            <span>{{ money | formatCurrency(2, true) }}</span
            >元) <span v-if="money > 0 ? true : false">(支持余额+网银组合支付)</span>
          </span>
          <span class="paymentType_right">
            <span v-show="!isCombine">余额{{ money | formatCurrency(2, true) }}元</span>
            <span v-show="isCombine && combineType">余额支付{{ money | formatCurrency(2, true) }}元</span>
          </span>
        </div>
        <div class="paymentType" v-if="item.paymentMethod == 3">
          <a-checkbox v-model="type.weChat" @change="change(item.paymentMethod, 'weChat')">
            <img src="@/assets/images/custom/wechat.png" class="imgsize" alt />
            <span class="fontWeight">微信支付</span>
          </a-checkbox>
        </div>
        <div class="paymentType" v-if="item.paymentMethod == 4">
          <a-checkbox v-model="type.alipay" @change="change(item.paymentMethod, 'alipay')">
            <img src="@/assets/images/custom/alipay.png" class="imgsize" alt />
            <span class="fontWeight">支付宝支付</span>
          </a-checkbox>
        </div>
        <div class="paymentType" v-if="item.paymentMethod == 5">
          <a-checkbox v-model="type.offline" @change="change(item.paymentMethod, 'offline')">
            <img src="@/assets/images/custom/onlinePic.png" class="imgsize" alt />
            <span class="fontWeight">线下支付</span>
          </a-checkbox>
          <div class="longText">
            企业汇款: (到账周期为1-2个工作日) , 请点击“确认并获取汇款识别码”,
            汇款时将识别码填写到【汇款用途】、【附言】、【摘要】等栏内
          </div>
        </div>
      </div>
    </div>

    <a-button v-if="!type.offline" type="primary" @click="antiShake" class="payment">立即支付</a-button>
    <a-button v-else type="primary" @click="open" class="payment">确认并获取汇款识别码</a-button>
    <!-- <Recharge ref="Recharge" /> -->
    <PaymentPasswordPopup
      :visible="paymentPasswordVisible"
      :paymentMethod="paymentMethod"
      :sceneType="sceneType"
      :orderCode="orderCode"
      :payerType="payerType"
      :paymentBalance="paymentBalance"
      @close="paymentPasswordVisible = false"
      @next="next"
    />
    <PasswordPopup
      :visible="passwordPopupVisible"
      :paymentMethod="paymentMethod"
      :sceneType="sceneType"
      :orderCode="orderCode"
      :payerType="payerType"
      :paymentBalance="paymentBalance"
      @close="passwordPopupVisible = false"
      @open="consolidatedPayment = true"
      :mergePaymentType="mergePaymentType"
    />
    <ConsolidatedPayment
      :visible="consolidatedPayment"
      :mergePaymentBillCode="orderCode"
      @close="consolidatedPayment = false"
    />
  </div>
</template>
<script>
import ConsolidatedPayment from '@/views/finance/payment/supplierPayment/consolidatedPayment'
// import JSEncrypt from 'jsencrypt' generatePaymentOrdere
import { getScenePaymentConuterList, orderCreate, depositApply } from '@/api/cashier'
import { generateQR } from '@/utils/qrcode'
import PaymentPasswordPopup from './paymentPasswordPopup'
import { decodeQrCode } from '@/utils/encrypt'
import PasswordPopup from './passwordPopup'
import { validOrderCode, checkOrder } from '@/api/fince'
// import Recharge from '../suppliers/homePage/offlinePayment.vue'
// import TransferBarVue from '@/components/Charts/TransferBar.vue'
const delay = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default {
  data() {
    return {
      consolidatedPayment: false,
      passwordPopupVisible: false,
      mergePaymentType: 0,
      paymentBalance: '',
      realBalance: 0, // 网银实际付款数
      money: '',
      paymentBillCode: '',
      sceneType: '',
      paymentPasswordVisible: false,
      type: {
        onlineBanking: false,
        balance: false,
        weChat: false,
        alipay: false,
        offline: false
      },
      showStatus: [],
      isCombine: false,
      flag: true,
      oddNumbers: '',
      orderCode: '',
      paymentMethod: '',
      combineType: false,
      payerType: 1,
      pageStr: '',
      PUBLIC_KEY:
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
    }
  },
  components: { PaymentPasswordPopup, PasswordPopup, ConsolidatedPayment },
  created() {
    console.log(this.$route.params)
    this.sceneType = Number(this.$route.params.id)
    this.orderCode = this.$route.params.orderCode
    this.payerType = this.$route.params.payerType ? Number(this.$route.params.payerType) : 1
    this.paymentBalance = this.$route.params.paymentBalance
    this.paymentBalance = this.delcommafy(this.paymentBalance)
    this.paymentBillCode = this.$route.params.paymentBillCode ? this.$route.params.paymentBillCode : ''
    this.mergePaymentType = this.$route.params.mergePaymentType ? this.$route.params.mergePaymentType : 0
  },
  mounted() {
    this.oddNumbers = this.$route.params.code
    this.getPayList()
  },
  methods: {
    open() {
      validOrderCode({ orderCode: this.orderCode }).then((res) => {
        if (res.code === '0') {
          this.$router.push({
            name: 'SysOperatorsHomeOfflinePayment',
            query: {
              sceneType: this.sceneType,
              orderCode: this.orderCode,
              payerType: this.payerType
            }
          })
        }
      })
      // 跳转线下支付页面
    },
    async getPayList() {
      const { sceneType } = this
      const res = await getScenePaymentConuterList({ sceneType: sceneType, paymentBillCode: this.paymentBillCode })
      if (res.code === '0') {
        this.money = this.money = res.data.freeBalance ? res.data.freeBalance : 0
        this.showStatus = res.data.resultList
        if (this.money > this.paymentBalance) {
          this.isCombine = false
        } else {
          this.isCombine = true
          this.realBalance = this.paymentBalance - this.money
        }
        // 缺判断需要拿到余额与支付金额进行对比 余额大于付款金额时将网银支付改为false
        if (this.money > this.paymentBalance && this.showStatus.length === 2) {
          this.$set(this.type, 'onlineBanking', false)
          this.$set(this.type, 'weChat', false)
          this.$set(this.type, 'alipay', false)
          this.$set(this.type, 'offline', false)
        }
      }
    },
    // 选择支付方式
    change(e, value) {
      if (e) {
        if (value) {
          this.paymentMethod = e
        }
        if (this.type.onlineBanking && this.type.balance && this.money > 0) {
          this.combineType = true
        } else {
          this.combineType = false
        }
        if (this.paymentMethod === 3 || this.paymentMethod === 4 || this.paymentMethod === 5) {
          this.$set(this.type, 'onlineBanking', false)
          this.$set(this.type, 'balance', false)
          this.$set(this.type, 'weChat', this.paymentMethod === 3)
          this.$set(this.type, 'alipay', this.paymentMethod === 4)
          this.$set(this.type, 'offline', this.paymentMethod === 5)
          this.combineType = false
        }
        if (!this.isCombine) {
          this.$set(this.type, 'onlineBanking', this.paymentMethod === 1)
          this.$set(this.type, 'balance', this.paymentMethod === 2)
          this.$set(this.type, 'weChat', this.paymentMethod === 3)
          this.$set(this.type, 'alipay', this.paymentMethod === 4)
          this.$set(this.type, 'offline', this.paymentMethod === 5)
          this.combineType = false
        } else {
          // 组合模式
          if (this.type.onlineBanking || this.type.balance) {
            this.$set(this.type, 'weChat', false)
            this.$set(this.type, 'alipay', false)
            this.$set(this.type, 'offline', false)
            if (this.type.onlineBanking && this.type.balance && this.money > 0) {
              this.combineType = true
            } else {
              this.combineType = false
            }
          }
        }
      }
    },
    antiShake() {
      delay(() => {
        this.payment()
      }, 500)
    },
    payment() {
      //  sceneType     1套餐费 11寻源保证金 12标书费 13平台保证金 14寻源保证金退还 15 平台保证金退还     8充值 81提现 16罚款 //收银台以外传入
      //  frontUrl      前端回调地址
      //  paymentMethod 支付方式  1银联 2账户 3微信 4支付宝 5线下打款 12组合银联账户支付
      //  payerType     1个人  2企业 //收银台以外传入
      //  orderCode     订单编码(业务单号)
      if (this.type.onlineBanking) {
        this.paymentMethod = 1
      } else if (this.type.balance) {
        this.paymentMethod = 2
      } else if (this.type.weChat) {
        this.paymentMethod = 3
      } else if (this.type.alipay) {
        this.paymentMethod = 4
      } else if (this.type.offline) {
        this.paymentMethod = 5
      }
      // 组合模式
      if (this.combineType) {
        this.paymentMethod = 12
      }
      if (!this.paymentMethod) {
        this.$message.info('支付方式不能为空')
        return
      }
      if (this.type.balance && !this.type.onlineBanking && this.money < this.paymentBalance) {
        this.$message.info('余额不足')
        return
      }

      if (this.combineType || this.type.balance) {
        checkOrder({ orderCode: this.orderCode }).then((res) => {
          if (res.code === '0') {
            if (this.sceneType === 14 || this.sceneType === 15) {
              this.passwordPopupVisible = true
            } else {
              this.paymentPasswordVisible = true
            }
          }
        })
      } else {
        this.next()
      }
    },
    next() {
      const params = {
        orderCode: this.orderCode,
        payerType: this.payerType,
        paymentMethod: this.paymentMethod,
        frontUrl: 'http://www.baidu.com',
        sceneType: this.sceneType
      }

      // 判读条件是否为8 充值是depositApply  其他为orderCreate
      // depositApply rechargeCode  订单编码 frontUrl 回调地址 paymentType 支付方式
      // 充值没有余额支付 线下支付
      if (this.sceneType === 8) {
        depositApply({
          rechargeCode: this.orderCode,
          frontUrl: 'http://www.baidu.com',
          paymentType: this.paymentMethod
        }).then((res) => {
          if (res.code === '0') {
            if (this.paymentMethod === 1) {
              window.open(res.data.payInfo ? res.data.payInfo : res.data.extendInfo)
              this.$router.push({
                name: 'InProcess',
                params: {
                  orderCode: this.orderCode,
                  realMoney: this.paymentBalance,
                  sceneType: this.sceneType,
                  cashierParams: JSON.stringify(this.$route.params)
                }
              })
            }
          }
        })
      } else {
        this.pageStr = 'WechatPayment'
        orderCreate(params).then((res) => {
          if (res.code === '0') {
            if (this.paymentMethod === 4) {
              this.pageStr = 'AlipayPayment'
            }
            if (this.paymentMethod === 4 || this.paymentMethod === 3) {
              // 此处url解密
              const url = decodeQrCode(res.data)
              const ss = generateQR(url)
              ss.then((res) => {
                console.log(res)
                this.$router.push({
                  name: this.pageStr,
                  params: {
                    realMoney: this.paymentBalance,
                    iconUrl: res,
                    orderCode: this.orderCode,
                    sceneType: this.sceneType,
                    cashierParams: JSON.stringify(this.$route.params)
                  }
                })
              })
            }
            if (this.paymentMethod === 1) {
              window.open(res.data ? res.data : res.data.extendInfo)
              console.log(JSON.stringify(this.$route.params))
              this.$router.push({
                name: 'InProcess',
                params: {
                  orderCode: this.orderCode,
                  realMoney: this.paymentBalance,
                  sceneType: this.sceneType,
                  cashierParams: JSON.stringify(this.$route.params)
                }
              })
            }
            if (this.paymentMethod === 2) {
              this.$router.push({
                name: 'paymentSuccessful',
                params: {
                  orderCode: this.orderCode,
                  realMoney: this.paymentBalance,
                  sceneType: this.sceneType
                }
              })
            }
          }
          //  else {
          //   this.$message.info('支付失败')
          // }
        })
      }
    },
    delcommafy(num) {
      if (num && num !== 'undefined' && num !== 'null') {
        let numS = num
        numS = numS.toString()
        numS = numS.replace(/,/gi, '')
        return numS
      } else {
        return num
      }
    }
  }
}
// const decrypt = new JSEncrypt()
// 设置私钥
// decrypt.setPrivateKey(this.PUBLIC_KEY)
// const url = decrypt.decrypt(res.data)
// console.log(res.data)
// this.pageStr = 'WechatPayment'
</script>
<style lang="less" scoped>
.cashier {
  width: 100%;
  background: #ffffff;
  padding: 40px;
  .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    span {
      font-weight: bold;
      margin-left: 8.8px;
      font-size: 22px;
      color: #333333;
      line-height: 40px;
      letter-spacing: 0;
    }
    div:nth-child(1) {
      flex: 1;
      .icon {
        border-radius: 49%;
        color: #ffffff;
        font-size: 40px;
        vertical-align: -11px;
        border: 0;
        background-image: linear-gradient(-191deg, #16e3a1 3%, #00c082 93%);
      }
    }
    .payment {
      font-size: 14px;
      color: #333333;
      span {
        color: #ff6b00;
      }
    }
  }
  .context {
    width: 100%;
    margin: 0 auto;
    margin-top: 51px;
    .titleText {
      height: 43px;
      background: #f4f4f4;
      line-height: 43px;
      padding-left: 20px;
      font-size: 18px;
      color: #333333;
      font-weight: 550;
    }
    .paymentType {
      position: relative;
      height: 88px;
      width: 100%;
      overflow: hidden;
      border: 1px solid #f4f4f4;
      line-height: 88px;
      padding: 0 19px;
      .imgsize {
        height: 35px;
      }
      span {
        margin-left: 16px;
      }
      .paymentType_central {
        font-size: 16px;
        color: #666666;
        span {
          color: #ff6b00;
        }
      }
      .paymentType_right {
        float: right;
        margin: 0;
        font-size: 16px;
        color: #666666;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 20px;
          color: #ff6b00;
          margin: 0;
          clear: both;
        }
      }
      .longText {
        position: absolute;
        width: 472px;
        height: 40px;
        font-size: 14px;
        color: #666666;
        word-wrap: break-word;
        line-height: initial;
        top: 25px;
        left: 201px;
      }
    }
  }
  .payment {
    height: 46px;
    margin-top: 50px;
  }
}
.icon {
  border-radius: 49%;
  color: #ffffff;
  font-size: 40px;
  vertical-align: -11px;
  background-image: linear-gradient(-191deg, #16e3a1 3%, #00c082 93%);
}
.fontWeight {
  font-weight: 600;
}
</style>
