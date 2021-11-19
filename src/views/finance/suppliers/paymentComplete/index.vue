<template>
  <div id="paymentComplete">
    <a-card :bordered="false">
      <a-row>
        <div>
          <h2>
            付款流水号:
            <span>{{ all.settlementCode }}</span>
            <a @click="copy(all.settlementCode)" style="margin-left: 10px">
              <a-icon type="copy" />
            </a>
          </h2>
        </div>
        <a-row>
          <a-col :span="8">
            <a-row>
              <p>
                <span>付款单号：</span>
                <span>{{ all.paymentBillCode }}</span>
              </p>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row>
              <p>
                <span>创建时间：</span>
                <span>{{ all.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
              </p>
            </a-row>
          </a-col>
        </a-row>
      </a-row>
    </a-card>
    <a-card style="margin-top: 30px" :bordered="false">
      <a-row>
        <header-title class="header-title">
          <span>付款明细</span>
        </header-title>
        <a-row style="line-height: 40px">
          <a-col :span="8">
            <a-row>
              <p>
                <span>应付金额：</span>
                <span>{{ all.feeAmt | formatCurrency(2, true) }}</span>
              </p>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row>
              <p>
                <span>实付金额：</span>
                <span>{{ all.feeAmt | formatCurrency(2, true) }}</span>
              </p>
            </a-row>
          </a-col>
        </a-row>
      </a-row>
    </a-card>
    <a-card style="margin-top: 30px" :bordered="false">
      <a-row>
        <a-row>
          <a-col :span="5">
            <div class="left">
              <h3>已付款</h3>
              <p>
                <span>付款方式：</span>
                <span v-show="all.paymentMethod === 1">银联</span>
                <span v-show="all.paymentMethod === 2">账户余额</span>
                <span v-show="all.paymentMethod === 3">微信</span>
                <span v-show="all.paymentMethod === 4">支付宝</span>
                <span v-show="all.paymentMethod === 5">线下支付</span>
              </p>
            </div>
          </a-col>
          <a-col :span="18">
            <div style class="right">
              <header-title class="header-title">
                <span>付款单位信息</span>
              </header-title>
              <div style="margin-left: 30px; line-height: 40px">
                <a-row>
                  <p>
                    <span>公司名称：</span>
                    <span>{{ all.payerAccountName }}</span>
                  </p>
                </a-row>
                <a-row>
                  <p>
                    <span>开户银行：</span>
                    <span>{{ all.payerBankName }}</span>
                  </p>
                </a-row>
                <a-row>
                  <p>
                    <span>账户名称：</span>
                    <span>{{ all.payerAccountName }}</span>
                  </p>
                </a-row>
                <a-row>
                  <p>
                    <span>银行账号：</span>
                    <span>{{ all.payerAccountNo }}</span>
                  </p>
                </a-row>
              </div>
              <div style="line-height: 30px; border-top: 1px solid #ccc; margin-top: 20px; padding-left: 24px">
                <a-row style="margin-top: 30px">
                  <a-col :span="10">
                    <a-row>
                      <p>
                        <span>本次付账金额：</span>
                        <span>{{ all.feeAmt | formatCurrency(2, true) }}</span>
                      </p>
                    </a-row>
                  </a-col>
                  <a-col :span="10">
                    <a-row>
                      <p>
                        <span>付款日期：</span>
                        <span>{{ all.updateTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                      </p>
                    </a-row>
                  </a-col>
                  <a-col :span="10">
                    <a-row>
                      <p>
                        <span>支付方式：</span>
                        <span v-show="all.paymentMethod === 1">银联</span>
                        <span v-show="all.paymentMethod === 2">账户余额</span>
                        <span v-show="all.paymentMethod === 3">微信</span>
                        <span v-show="all.paymentMethod === 4">支付宝</span>
                        <span v-show="all.paymentMethod === 5">线下支付</span>
                      </p>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-row>
    </a-card>
    <a-card style="margin-top: 30px" :bordered="false">
      <a-row>
        <a-col :span="5">
          <div class="lefts">
            <h3>已收款</h3>
            <span>收款方已确认收款</span>
          </div>
        </a-col>
        <a-col :span="17">
          <div style="line-height: 30px" class="right">
            <header-title class="header-title">
              <span>收款单位信息</span>
            </header-title>
            <div style="margin-left: 30px">
              <a-row>
                <p>
                  <span>公司名称：</span>
                  <span>{{ all.payeeAccountName }}</span>
                </p>
              </a-row>
              <a-row>
                <p>
                  <span>开户银行：</span>
                  <span>{{ all.payeeBankName }}</span>
                </p>
              </a-row>
              <a-row>
                <p>
                  <span>账户名称：</span>
                  <span>{{ all.payeeAccountName }}</span>
                </p>
              </a-row>
              <a-row>
                <p>
                  <span>银行账号：</span>
                  <span>{{ all.payeeAccountNo }}</span>
                </p>
              </a-row>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import { PaymentDetails } from '@/api/invoice'
export default {
  data() {
    return {
      all: ''
    }
  },
  mounted() {
    this.PaymentDetails({ id: this.$route.query.id })
  },
  methods: {
    copy(text) {
      var domUrl = document.createElement('input')
      domUrl.value = text
      domUrl.id = 'creatDom'
      document.body.appendChild(domUrl)
      domUrl.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      const creatDom = document.getElementById('creatDom')
      creatDom.parentNode.removeChild(creatDom)
      this.$message.success('复制成功')
    },
    async PaymentDetails(text) {
      try {
        const data = await PaymentDetails(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          console.log(newData.data)
          this.all = newData.data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#paymentComplete {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #262626;
  line-height: 18px;
  .left {
    text-align: center;
    line-height: 30px;
    padding-top: 100px;
  }
  .lefts {
    text-align: center;
    line-height: 30px;
    padding-top: 50px;
    color: #262626;
  }
  .header-title {
    border-bottom: none;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 24px;
    color: #262626;
  }
  .right {
    border-left: 1px solid #ccc;
    padding-left: 24px;
    color: #262626;
  }
  h2 {
    font-size: 20px;
    font-weight: bold;
  }
  h3 {
    color: #666666;
  }
  p {
    height: 20px;
    color: #262626;
  }
}
</style>
