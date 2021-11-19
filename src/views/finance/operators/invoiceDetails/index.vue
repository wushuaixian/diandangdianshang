
<template>
  <div id="paymentDetails">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="5">
          <div class="left">
            <p>状态</p>
            <h3 v-show="all.status === 1">待开票</h3>
            <h3 v-show="all.status === 2">已开票</h3>
            <h3 v-show="all.status === 3">已作废</h3>
            <span
              v-show="all.status === 2"
              @click="dowlod(all.pdfUrl === null ? all.qrCodeUrl : all.pdfUrl)"
              style="color: #ff6b00; cursor: pointer"
            >
              下载发票附件
            </span>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="right">
            <h2>
              发票任务ID:
              <span>{{ all.invoiceTaskId }}</span>
              <a @click="copy(all.invoiceTaskId)" style="margin-left: 10px">
                <a-icon type="copy" />
              </a>
              <span class="orderCodeLeft">
                订单编号:
                <span>{{ all.orderCode }}</span>
                <a @click="copy(all.orderCode)" style="margin-left: 10px">
                  <a-icon type="copy" />
                </a>
              </span>
            </h2>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p>
                    <span>开票类型：</span>
                    <span v-show="all.invoiceTitleType == 2">增值税专用发票</span>
                    <span v-show="all.invoiceTitleType == 1">增值税普通发票</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>发票性质：</span>
                    <span v-show="all.invoiceFileType == 1">电子发票</span>
                    <span v-show="all.invoiceFileType == 2">纸质发票</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p class="textLength">
                    <span>收票方：</span>
                    <span :title="all.buyerName">{{ all.buyerName }}</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>抬头类型：</span>
                    <span>企业</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <p class="textLengths">
                  <span>摘要：</span>
                  <span :title="all.digest">{{ all.digest }}</span>
                </p>
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
        <a-col :span="6">
          <a-row>
            <p class="textLength">
              <span>发票抬头：</span>
              <span :title="all.invoiceTitle">{{ all.invoiceTitle }} </span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row>
            <p>
              <span>纳税人识别号：</span>
              <span>{{ all.buyerTaxpayerIdentificationCode }}</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <p class="textLength address">
              <span>地址：</span>
              <span :title="all.buyerAddress">{{ all.buyerAddress }}</span>
            </p>
          </a-row>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-row>
            <p class="textLength">
              <span>开户银行：</span>
              <span>{{ all.buyerBankName }}</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row>
            <p>
              <span>开户账号：</span>
              <span>{{ all.buyerBankAccount }}</span>
            </p>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row>
            <p>
              <span>电话：</span>
              <span>{{ all.buyerMobile }}</span>
            </p>
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
              <p>
                <span>收件人：</span>
                <span>{{ all.personName }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>电话：</span>
                <span>{{ all.presonTelephone }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>发票邮寄地址：</span>
                <span>{{ all.province }}{{ all.city }}{{ all.area }}{{ all.adrress }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>物流公司：</span>
                <span>{{ all.expressCompanyName }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>物流单号：</span>
                <span>
                  {{ all.expressNumber }}
                  <a @click="copy(all.expressNumber)" style="margin-left: 10px">
                    <a-icon type="copy" />
                  </a>
                  <a-popover style="margin-left: 20px" title="">
                    <template slot="content">
                      <div v-if="information.length > 0" style="width: 200px; height: 300px; overflow: auto">
                        <a-timeline style="margin: 10px" v-for="(item, index) in information" :key="index">
                          <a-timeline-item>
                            {{ item.remark ? item.remark : '' }}<br />
                            <a>{{ item.logisticsTime ? item.logisticsTime : '' | moment('YYYY-MM-DD HH:mm:ss') }}</a>
                          </a-timeline-item>
                        </a-timeline>
                      </div>
                      <div v-else style="width: 200px; height: 30px; overflow: auto">
                        <a-timeline style="margin: 10px">
                          <a-timeline-item> 暂无物流信息 </a-timeline-item>
                        </a-timeline>
                      </div>
                    </template>
                    <a type="primary">物流信息</a>
                  </a-popover>
                </span>
              </p>
            </a-row>
          </div>
        </a-col>
        <a-col style="line-height: 30px" :span="12">
          <header-title class="header-title">
            <span>发票其他信息</span>
          </header-title>
          <a-row>
            <p>
              <span>发票代码：</span>
              <span>{{ all.invoiceCode }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>发票号码：</span>
              <span>{{ all.invoiceNo }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>开票时间：</span>
              <span>{{ all.invoiceDate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>备注：</span>
              <span>{{ all.remark }}</span>
            </p>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <div class="button">
      <Applys v-show="all.status === 3 && all.invoiceStatus !== 5 && !$hasOpeerate()" id="applys" ref="applys" />
      <!-- <a-button @click="Void" type="primary" v-show="all.status === 2">作废</a-button> -->
      <a-button @click="Void" type="primary" v-show="$hasOpeerate()">作废</a-button>
      <a-button
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
import { details, newOrderMessage } from '@/api/invoice'
import Void from '@/views/finance/components/void'
import Applys from './components/applys.vue'
// import axios from 'axios'
export default {
  data() {
    return {
      all: '',
      information: {}
    }
  },
  components: {
    Void,
    Applys
  },
  methods: {
    Void() {
      this.$refs.void.visible = true
      this.$refs.void.form.id = this.all.id
    },
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
    async newOrderMessage(text) {
      try {
        const data = await newOrderMessage(text)
        if (data.code === '0') {
          this.information = data.data
          console.log(this.information)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async details(text) {
      try {
        const data = await details({
          invoiceId: text
        })
        if (data.code === '0') {
          this.all = data.data
          console.log(this.all.packageCode)
          // 物流信息的接口
          if (this.all.packageCode) {
            this.newOrderMessage({ orderCode: this.all.invoiceTaskId, packageCode: this.all.packageCode })
          }
          // this.newOrderMessage({ orderCode: 'FK703269597184', packageCode: 'P2106301509381260001' })
        }
        console.log(this.all)
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.details(this.$route.params.id)
    this.$refs.applys.form.paymentBillCode = this.all.paymentBillCode
    this.$refs.applys.form.receiptAdrressId = this.all.receiptAdrressId
  }
}
</script>

<style lang="less" scoped>
#paymentDetails {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #262626;
  .left {
    color: #262626;
    text-align: center;
    padding-top: 20px;
    & > :nth-of-type(1) {
      color: #666666;
    }
    h3 {
      color: #262626 !important;
      font-size: 20px;
      font-weight: bold;
    }
  }
  p {
    height: 28px !important;
    color: #262626;
  }
  .right {
    color: #262626;
    padding-left: 24px;
    border-left: 1px solid #f1f2f5;
    line-height: 40px;
  }
  .header-title {
    border-bottom: none;
    font-weight: bold;
    font-size: 16px;
    // margin-bottom: 15px;
  }
  .button {
    text-align: center;
    margin-top: 50px;
  }
  #applys {
    position: relative;
    left: -100px;
    top: 33px;
  }
  #textss {
    margin-left: -13px;
  }
  #presonTelephone {
    margin-left: -9px;
  }
  #province {
    margin-left: -18px;
  }
}
.textLength {
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.textLengths {
  margin-top: -15px;
  width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.address {
  width: 370px;
}
.orderCodeLeft {
  margin-left: 10px;
}
</style>
