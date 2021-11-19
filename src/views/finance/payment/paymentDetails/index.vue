
<template>
  <div id="paymentDetails">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="5">
          <div class="left">
            <p>状态</p>
            <h3 v-show="all.billStatus === 6">付款中</h3>
            <h3 v-show="all.billStatus === 8">已完成</h3>
            <h3 v-show="all.billStatus === 7">待确认</h3>
            <h3 v-show="all.billStatus === 1">待审核</h3>
            <h3 v-show="all.billStatus === 2">审核不通过</h3>
            <h3 v-show="all.billStatus === 9">已关闭</h3>
            <a-button @click="examines" v-show="false" type="primary">审核</a-button>
            <!-- <Payment v-show="all.billStatus === 6 && !all.paymentSerial" :all="all" /> -->
            <a-button @click="goPayment" v-show="all.billStatus === 6 && !all.paymentSerial" type="primary">
              付款
            </a-button>
            <Uploads v-show="all.paymentSerial && !all.address" :all="all" />
            <ImagePreview v-show="all.address" :width="50" :height="30" :value="all.address ? all.address : ''" />
            <p v-show="all.paymentSerial" class="p">
              <span>汇款识别码：</span>
              <span>{{ all.paymentSerial }}</span>
            </p>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="right">
            <h2>
              <span>付款单号：</span>
              <span>
                {{ all.paymentBillCode }}
                <a @click="copy(all.paymentBillCode)" style="margin-left: 10px">
                  <a-icon type="copy" />
                </a>
              </span>
              <span class="orderCode">订单编号：</span>
              <span>
                {{ all.paymentCode }}
                <a @click="copy(all.paymentCode)" style="margin-left: 10px">
                  <a-icon type="copy" />
                </a>
              </span>
            </h2>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p>
                    <span>创建时间：</span>
                    <span>{{ all.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>付款金额：</span>
                    <span>{{ all.feeAmt | formatCurrency(2, true) }}元</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p>
                    <span>交易类型：</span>
                    <span v-show="all.sceneType == 14">退还保证金</span>
                    <span v-show="all.sceneType == 1">套餐费</span>
                    <span v-show="all.sceneType == 12">标书费</span>
                    <span v-show="all.sceneType == 13">平台保证金</span>
                    <span v-show="all.sceneType == 11">寻源保证金</span>
                    <span v-show="all.sceneType == 16">罚款</span>
                    <span v-show="all.sceneType == 15">平台保证金退还</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>摘要：</span>
                    <span>{{ all.summary }}</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="12">
          <div style="width: 95%; height: 100%; border-right: 1px solid #f1f2f5; line-height: 40px">
            <header-title class="header-title">
              <span>付款单位信息</span>
            </header-title>
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
        </a-col>
        <a-col style="line-height: 40px" :span="12">
          <header-title class="header-title">
            <span>收款单位信息</span>
          </header-title>
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
        </a-col>
      </a-row>
    </a-card>
    <appdflow-progress ref="progress" :typeCode="typeCode" :bizCode="all.paymentBillCode" />
    <a-card :bordered="false">
      <header-title class="header-title">
        <span>结算明细</span>
      </header-title>
      <a-row>
        <a-col :span="6">
          <a-row>
            <p>
              <span>应付单号：</span>
              <span>{{ all.feeBillCode }}</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row>
            <p>
              <span>应付金额：</span>
              <span>{{ all.feeAmt | formatCurrency(2, true) }}元</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row>
            <p>
              <span>已付金额：</span>
              <span>{{ all.paidAmt | formatCurrency(2, true) }}元</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row>
            <p>
              <span>未付金额：</span>
              <span>{{ all.abs | formatCurrency(2, true) }}元</span>
            </p>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <Examine ref="examine" />
  </div>
</template>

<script>
import { BillCode } from '@/api/invoice'
import Examine from './components/examine.vue'
import Payment from './components/payment.vue'
import Uploads from './components/uploads.vue'
import ImagePreview from '@/components/ImagePreview'
export default {
  data() {
    return {
      all: {},
      typeCode: '',
      form: {
        url: ''
      }
    }
  },
  methods: {
    copy(url) {
      const domUrl = document.createElement('input')
      domUrl.value = url
      domUrl.id = 'creatDom'
      document.body.appendChild(domUrl)
      domUrl.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      const creatDom = document.getElementById('creatDom')
      creatDom.parentNode.removeChild(creatDom)
      this.$message.success('复制成功')
    },
    async BillCode(text) {
      try {
        const data = await BillCode({
          id: text
        })
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.all = newData.data
          this.all.abs = this.all.feeAmt - this.all.paidAmt
          // console.log(this.all.address)
        }
      } catch (err) {
        console.log(err)
      }
    },
    goPayment() {
      this.$router.push({
        name: 'FinancePaymentCashier',
        params: {
          id: this.all.sceneType,
          orderCode: this.all.paymentCode,
          paymentBalance: this.all.feeAmt,
          type: 2,
          payerType: 2,
          paymentBillCode: '1',
          mergePaymentType: 0
        }
      })
    },
    examines() {
      this.$refs.examine.visible = true
      this.$refs.examine.form.paymentBillCode = this.all.paymentBillCode
    }
  },
  components: {
    Examine,
    Payment,
    Uploads,
    ImagePreview
  },
  mounted() {
    this.BillCode(this.$route.params.id)
  },
  created() {
    if (this.$hasOpeerate()) {
      this.typeCode = 'plat_payment_bill'
    } else {
      this.typeCode = 'purchase_payment_bill'
    }
  }
}
</script>

<style lang="less" scoped>
#paymentDetails {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #262626;
  line-height: 18px;
  .ant-card + .ant-card {
    margin-top: 20px;
    color: #262626;
  }
  .left {
    text-align: center;
    padding-top: 20px;
    border-right: 1px solid #f1f2f5;
    h3 {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .ant-row {
    p {
      height: 24px !important;
    }
  }
  .right {
    padding-left: 24px;
    line-height: 40px;
    color: #262626;
    h2 {
      font-weight: bold;
      font-size: 16px;
    }
  }
  #textssa {
    margin-left: -8px;
  }
  .p {
    font-size: 12px;
    color: #262626;
    margin-top: 8px;
  }
  .header-title {
    border-bottom: 1px solid #fff;
    font-weight: bold;
    font-size: 16px;
    // margin-bottom: 24px;
  }
}
.orderCode {
  margin-left: 10px;
}
</style>
