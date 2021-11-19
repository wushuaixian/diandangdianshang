
<template>
  <div id="paymentDetails">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="7">
          <div class="left">
            <p>状态</p>
            <h3 v-show="all.status === 1">待开票</h3>
            <h3 v-show="all.status === 2">已开票</h3>
            <h3 v-show="all.status === 3">已作废</h3>
            <span
              @click="dowlod(all.pdfUrl === null ? all.qrCodeUrl : all.pdfUrl)"
              style="color: #38f; cursor: pointer"
            >
              下载发票附件
            </span>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="right">
            <h2>
              发票任务ID: <span>{{ all.invoiceTaskId }}</span>
              <a @click="copy(all.invoiceTaskId)" style="margin-left: 10px"><a-icon type="copy" /> </a>
            </h2>
            <a-row>
              <a-col :span="12">
                <a-row>
                  <a-col :span="5">开票类型:</a-col>
                  <a-col v-show="all.invoiceTitleType === 0" :span="19">蓝票</a-col>
                  <a-col v-show="all.invoiceTitleType === 1" :span="19">红票</a-col>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-col :span="5">发票性质:</a-col>
                  <a-col v-show="all.invoiceFileType === 1" :span="19">电子发票</a-col>
                  <a-col v-show="all.invoiceFileType === 2" :span="19">纸质发票</a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-row>
                  <a-col :span="5">收票方:</a-col>
                  <a-col :span="19">{{ all.buyerName }}</a-col>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-col :span="5">抬头类型:</a-col>
                  <a-col v-show="all.invoiceTitleType === 1" :span="19">企业</a-col>
                  <a-col v-show="all.invoiceTitleType === 2" :span="19">个人</a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-top: 20px; line-height: 40px" :bordered="false">
      <header-title class="header-title">
        <span>结算明细</span>
      </header-title>
      <a-row>
        <a-col :span="8">
          <a-row>
            <a-col :span="5"> 发票抬头: </a-col>
            <a-col :span="19"> {{ all.invoiceTitle }} </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <a-col :span="7"> 纳税人识别号: </a-col>
            <a-col :span="17"> {{ all.buyerTaxpayerIdentificationCode }} </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <a-col :span="3"> 地址: </a-col>
            <a-col :span="21"> {{ all.buyerAddress }} </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-row>
            <a-col :span="5"> 开户银行: </a-col>
            <a-col :span="19"> {{ all.buyerBankName }} </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <a-col :span="7"> 开户账号: </a-col>
            <a-col :span="17"> {{ all.buyerBankAccount }} </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <a-col :span="3"> 电话: </a-col>
            <a-col :span="21"> {{ all.buyerMobile }} </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-top: 20px; line-height: 40px" :bordered="false">
      <a-row>
        <a-col :span="12">
          <div style="width: 95%; height: 100%; border-right: 1px solid #f1f2f5; line-height: 30px">
            <header-title class="header-title">
              <span>发票邮寄信息</span>
            </header-title>
            <a-row>
              <a-col style="color: black" :span="4">收件人:</a-col>
              <a-col :span="20">{{ all.personName }}</a-col>
            </a-row>
            <a-row>
              <a-col style="color: black" :span="4">电话:</a-col>
              <a-col :span="20">{{ all.presonTelephone }}</a-col>
            </a-row>
            <a-row>
              <a-col style="color: black" :span="5">发票邮寄地址:</a-col>
              <a-col :span="19">{{ all.province }}{{ all.city }}{{ all.area }}{{ all.adrress }}</a-col>
            </a-row>
            <a-row>
              <a-col style="color: black" :span="4">物流公司:</a-col>
              <a-col :span="20">{{ all.expressCompanyName }}</a-col>
            </a-row>
            <a-row>
              <a-col style="color: black" :span="4">物流单号:</a-col>
              <a-col :span="20">
                {{ all.expressNumber }}
                <a @click="copy(all.expressNumber)" style="margin-left: 10px"><a-icon type="copy" /> </a>
                <a @mouseover="changeMask()" @mouseout="changeMask()" style="margin-left: 20px">物流信息</a></a-col
              >
            </a-row>
          </div>
        </a-col>
        <a-col style="line-height: 30px" :span="12">
          <header-title class="header-title">
            <span>发票其他信息</span>
          </header-title>
          <a-row>
            <a-col style="color: black" :span="4">发票代码:</a-col>
            <a-col :span="20">{{ all.invoiceCode }}</a-col>
          </a-row>
          <a-row>
            <a-col style="color: black" :span="4">发票号码:</a-col>
            <a-col :span="20">{{ all.invoiceNo }}</a-col>
          </a-row>
          <a-row>
            <a-col style="color: black" :span="4">开票时间:</a-col>
            <a-col :span="20">{{ all.invoiceDate | moment }}</a-col>
          </a-row>
          <a-row>
            <a-col style="color: black" :span="4">备注:</a-col>
            <a-col :span="20">{{ all.remark }}</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <div class="button">
      <a-button type="primary" v-show="all.status === 3" @click="apply"> <Apply ref="apply" /> </a-button>
      <a-button type="primary" v-show="all.status === 2" @click="voids"> 作废 </a-button>
      <a-button
        style="margin-left: 50px"
        type="primary"
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        返回
      </a-button>
    </div>
    <Void ref="void" />
  </div>
</template>

<script>
import { details } from '@/api/invoice'
import Void from '@/views/finance/components/void'
import Apply from './components/apply'

export default {
  data() {
    return {
      all: ''
    }
  },
  methods: {
    apply() {
      this.$refs.apply.visible = true
      this.$refs.apply.all.paymentBillCode = this.all.paymentBillCode
      this.$refs.apply.all.eceiptAdrressId = this.all.receiptAdrressId
    },
    // 点击作废
    voids() {
      this.$refs.void.visible = true
      this.$refs.void.form.id = Number(this.$route.query.id)
    },
    changeMask() {
      console.log('鼠标滑过')
      console.log(this.all)
    },
    copy(url) {
      var domUrl = document.createElement('input')
      domUrl.value = url
      domUrl.id = 'creatDom'
      document.body.appendChild(domUrl)
      domUrl.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      const creatDom = document.getElementById('creatDom')
      creatDom.parentNode.removeChild(creatDom)
      this.$message.success('复制成功')
    },
    // 下载
    async dowlod(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      a.remove()
    },
    async details(text) {
      try {
        const data = await details({
          invoiceId: 50
        })
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.all = newData.data
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: {
    Void,
    Apply
  },
  mounted() {
    this.details(Number(this.$route.query.id))
  }
}
</script>

<style lang="less" scoped>
#paymentDetails {
  .left {
    width: 300px;
    height: 150px;
    text-align: center;
    padding-top: 20px;
    border-right: 1px solid #f1f2f5;
    h3 {
      font-size: 20px;
    }
  }
  .right {
    line-height: 40px;
  }
  .button {
    text-align: center;
    margin-top: 50px;
  }
}
</style>
