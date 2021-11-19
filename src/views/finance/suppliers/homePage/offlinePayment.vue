<template>
  <div class="offlinePayment">
    <a-row>
      <div class="title">
        <div>
          <span>线下支付</span>
        </div>
      </div>
      <img id="image" src="@/assets/images/user/xxx.png" alt="" />
      <div class="warningInfo">
        <div>
          <span>注意事项</span><br />
          <span class="text">汇款时需要注意以下信息，请牢记!</span>
        </div>
      </div>
      <div class="content">
        <span>
          1.您的汇款识别码为:
          <span class="spanColor">
            {{ all.bankBranchNumer }}
          </span>
          :线下公司转账需将此汇款识别码填写至电汇凭证的
          <span class="spanColorContent"> 【汇款用途】、【附言】、【摘要】 等栏内。 </span>
        </span>
        <br />
        <p class="content_p">(提醒: 因银行不同备注字段不同，请将所有可填写备注的位置均填写上汇款识别码)</p>
        <p>
          2.线下转账订单，<span class="spanColorContent">请一个识别码对应一个订单和相应的金额，请勿多转少转。</span>
        </p>
        <p>
          3.为确保缴费及时核销，
          <span class="spanColorContent">
            线下转账时请务必填写正确的汇款识别码，勿私自添加其他文字说明（识别码前请勿添加任何前缀）
          </span>
        </p>
        <div class="text3">
          <p><span>开户行:</span><span>兴业银行天津城厢支行</span></p>
          <p><span>账户名称:</span><span>叮当（天津）电子商务有限公司</span></p>
          <p><span>账号：</span><span>441260100100159245</span></p>
        </div>
        <div>
          <p class="textbottom">发送手机号为支付绑定手机号，可修改接收信息手机号</p>
          <div>
            将你的汇款识别码
            <span class="spanColor">
              {{ all.bankBranchNumer }}
            </span>
            发送至:
            <span> <a-input :value="all.paymentPhone" /></span>
            <span> <a-button class="but" @click="sendOut" type="primary"> 立即发送 </a-button></span>
          </div>
        </div>
      </div>
    </a-row>
  </div>
</template>
<script>
import { generatePaymentOrdere, paymentSerial } from '@/api/invoice.js'
export default {
  name: 'SysOperatorsHomeOfflinePayment',
  data() {
    return {
      all: {}
    }
  },
  mounted() {
    this.generatePaymentOrdere({
      sceneType: this.$route.query.sceneType,
      orderCode: this.$route.query.orderCode,
      payerType: this.$route.query.payerType,
      paymentMethod: 5
    })
  },
  methods: {
    sendOut() {
      this.paymentSerial({
        mobile: this.all.paymentPhone,
        captchas: this.all.bankBranchNumer,
        type: 61,
        requestParameter: { allinpayId: this.all.allinpayId, paymentSerial: this.all.bankBranchNumer }
      })
      this.$router.push({
        name: this.$hasOpeerate() ? 'SysPaymentManageDetail' : 'SuppliersPaymentManageDetail',
        params: {
          id: this.all.id
        }
      })
    },
    async paymentSerial(text) {
      try {
        const data = await paymentSerial(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          console.log(newData)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async generatePaymentOrdere(text) {
      try {
        const data = await generatePaymentOrdere(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.all = newData.data
        }
        console.log(this.all)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.offlinePayment {
  padding: 30px;
  width: 960px;
  height: 623px;
  margin: 0 auto;
  border-radius: 8px;
  background: #ffffff;
  .title {
    text-align: center;
    div {
      width: 128px;
      display: inline-block;
      height: 42px;
      border-bottom: 6px solid #ff6b00;
      span {
        font-size: 32px;
        color: #262626;
      }
    }
  }
  #image {
    width: 18px;
    height: 18px;
    position: relative;
    top: 67px;
    left: 40px;
  }
  .warningInfo {
    width: 100%;
    height: 78px;
    background: rgba(255, 107, 0, 0.1);
    margin-top: 30px;
    padding: 16px 24px;

    div {
      margin-left: 30px;
      span {
        font-size: 16px;
        color: #262626;
        margin-left: 11px;
      }
      img {
        width: 18px;
        height: 18px;
      }
      .text {
        margin-left: 10px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .content {
    margin-top: 23px;
    padding-left: 20px;
    width: 100%;
    height: 300px;
    // background: red;
    .spanColor {
      font-family: PingFangSC-Regular;
      font-size: 20px;
      color: #ff6b00;
      letter-spacing: 0;
      line-height: 24px;
    }
    .spanColorContent {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ff6b00;
      letter-spacing: 0;
      line-height: 24px;
    }
    .content_p {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ff6b00;
      letter-spacing: 0.86px;
      line-height: 22px;
      margin-top: 6px;
    }
  }
  .ant-input {
    width: 250px;
    height: 38px;
  }
  .but {
    height: 38px;
    width: 100px;
    margin-left: 30px;
  }
}
.text3 {
  background: #f9f9f9;
  height: 108px;
  padding: 16px 24px;
  margin-bottom: 24px;
  p {
    margin: 0;
    margin-bottom: 8px;
  }
}
.textbottom {
  font-size: 14px;
  color: #8c8c8c;
}
</style>
