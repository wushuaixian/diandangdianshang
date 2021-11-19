<template>
  <div id="paymentDetails">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="5" class="leftLine" v-if="data.billStatus === 1 && data.receiptSerial != ''">
          <div class="left">
            <p>状态</p>
            <h3>收款中</h3>
            <p>
              <a-button type="primary" @click="confirmReceipt(data)">确定收款</a-button>
            </p>
          </div>
        </a-col>
        <a-col :span="5" class="leftLine" v-if="data.billStatus === 2">
          <div class="left">
            <p>状态</p>
            <h3>待确认</h3>
            <p>
              <a-button type="primary" @click="confirmReceipt(data)">确定收款</a-button>
            </p>
          </div>
        </a-col>
        <a-col :span="5" v-if="data.billStatus === 3">
          <div class="left">
            <p>状态</p>
            <h3>已完成</h3>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="right" v-if="data.billStatus !== 3">
            <h2>
              <span>收款单号：</span>
              <span>
                {{ data.receiptBillCode }}
                <a @click="copy(data.receiptBillCode)">
                  <a-icon type="copy" />
                </a>
              </span>
            </h2>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p>
                    <span>创建时间：</span>
                    <span>{{ data.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>创建人：</span>
                    <span>{{ data.createUsername }}</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <div class="right rightLine" v-if="data.billStatus == 3">
            <h2>
              <span>收款单号：</span>
              <span>
                {{ data.receiptBillCode }}
                <a @click="copy(data.receiptBillCode)">
                  <a-icon type="copy" />
                </a>
              </span>
            </h2>
            <a-row>
              <a-col :span="8">
                <a-row>
                  <p>
                    <span>付款方式：</span>
                    <span v-show="data.paymentMethod == 1">银联</span>
                    <span v-show="data.paymentMethod == 2">账户</span>
                    <span v-show="data.paymentMethod == 3">微信</span>
                    <span v-show="data.paymentMethod == 4">支付宝</span>
                    <span v-show="data.paymentMethod == 5">线下打款</span>
                  </p>
                </a-row>
                <a-row>
                  <p>
                    <span>创建时间：</span>
                    <span>{{ data.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <p>
                    <span>创建人：</span>
                    <span>{{ data.createUsername }}</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-top: 20px" :bordered="false">
      <a-row>
        <a-col :span="12">
          <div class="paymentUnit">
            <header-title class="header-title">
              <span>付款单位信息</span>
            </header-title>
            <a-row>
              <p>
                <span>公司名称：</span>
                <span>{{ data.payerAccountName }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>联系人姓名：</span>
                <span>{{ data.createUsername }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>联系人电话：</span>
                <span>{{ data.paymentPhone }}</span>
              </p>
            </a-row>
            <a-row>
              <p>
                <span>地址：</span>
                <span>{{ data.address }}</span>
              </p>
            </a-row>
          </div>
        </a-col>
        <a-col class="payee" :span="12">
          <header-title class="header-title">
            <span>收款单位信息</span>
          </header-title>
          <a-row>
            <p>
              <span>公司名称：</span>
              <span>{{ data.payeeAccountName }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>开户银行：</span>
              <span>{{ data.payeeBankName }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>开户银行支行名称：</span>
              <span>{{ data.openBranchName }}</span>
            </p>
          </a-row>
          <a-row>
            <p>
              <span>银行账号：</span>
              <span>{{ data.payeeAccountNo }}</span>
            </p>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-if="data.billStatus !== 3" :bordered="false">
      <header-title class="header-title">
        <span>结算明细</span>
      </header-title>
      <a-row>
        <a-col :span="6">
          <a-row>
            <p>
              <span>应收金额：</span>
              <span>{{ feeAmt | formatCurrency(2, true) }}元</span>
            </p>
          </a-row>
          <!-- <a-row>
            <a-col style="color: black" :span="7">应收金额(CNY):</a-col>
            <a-col :span="17">2337.23元</a-col>
          </a-row>-->
        </a-col>
      </a-row>
      <Received ref="Received" @ok="receiptDetailsID" />
    </a-card>
    <a-card v-if="data.billStatus == 3 || data.billStatus == 2" :bordered="false">
      <header-title class="header-title">
        <span>结算明细</span>
      </header-title>
      <a-row class="settlement">
        <a-col :span="5">
          <p>
            <span>实收金额：</span>
            <span>{{ data.feeAmt | formatCurrency(2, true) }}元</span>
          </p>
        </a-col>
        <a-col :span="18" v-if="ImagePreview.length > 0">
          <a-row class="paymentVoucher">
            <div>
              <span>付款凭证：</span>
            </div>
            <div>
              <div>
                <ImagePreview
                  :width="100"
                  :height="100"
                  :value="ImagePreview.length > 0 ? ImagePreview[0].fileAdress : ''"
                />
              </div>
              <ul class="file">
                <li v-for="(item, index) in imageAndAddress" :key="index" @click="downloadByURL(item.fileAdress)">
                  <span>
                    <a-icon type="paper-clip" class="paperClip" />
                    <span>{{ item.fileName }}</span>
                  </span>
                  <span>下载</span>
                </li>
              </ul>
            </div>
          </a-row>
        </a-col>
      </a-row>
      <!-- <Totaling ref="totaling" /> -->
      <Received ref="Received" @ok="receiptDetailsID" />
    </a-card>
  </div>
</template>

<script>
import { Received } from '../collectionManagement/components'
import { receiptDetailsID } from '@/api/receipt'
import ImagePreview from '@/components/ImagePreview'
export default {
  data() {
    return {
      ImagePreview: '',
      data: '',
      feeAmt: '',
      handleFileRemove(file) {
        console.log(file)
      },
      imageAndAddress: []
    }
  },
  components: { Received, ImagePreview },
  created() {
    this.receiptDetailsID()
  },
  methods: {
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
    handleChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
    },
    async receiptDetailsID() {
      const { data } = await receiptDetailsID(this.$route.params.id)
      // const { data } = await receiptDetailsID(1)
      this.data = data
      this.feeAmt = data.feeAmt.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
      this.imageAndAddress = data.imageAndAddress
      this.ImagePreview = []
      this.ImagePreview = data.imageAndAddress.filter((v) => v.fileAdress)
    },
    async downloadByURL(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      a.remove()
    },
    // 确认收款
    confirmReceipt(data) {
      this.$refs['Received'].init(data)
    }
  }
}
</script>

<style lang="less" scoped>
#paymentDetails {
  .ant-card + .ant-card {
    margin-top: 20px;
    color: #262626;
  }
  .left {
    & > :first-child {
      color: #666666;
    }
    text-align: center;
    padding-top: 20px;
    color: #262626;
    h3 {
      font-size: 20px;
      font-weight: bold;
    }
  }
  p {
    height: 24px !important;
  }
  .leftLine {
    border-right: 1px solid #f1f2f5;
  }
  .rightLine {
    border-left: 1px solid #f1f2f5;
  }
  .right {
    line-height: 40px;
    color: #262626;
    padding-left: 30px;
    h2 {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .payee {
    // line-height: 30px
    padding-left: 24px;
  }
  .paymentUnit {
    // width: 95%;
    // height: 100%;
    border-right: 1px solid #f1f2f5;
    line-height: 30px;
  }
  .header-title {
    border-bottom: 1px solid #fff;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 15px;
  }
  .settlement {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    line-height: 18px;
    font-weight: 400;
    margin-top: 24px;
  }
  .paymentVoucher {
    display: flex;
  }
  .file {
    // width: 250px;
    margin-left: -44px;
    margin-top: 10px;
    color: #ff6b00;
    color: #262626;
    li {
      cursor: pointer;
      margin-top: 3px;
      // background: #F9F9F9;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      color: #ff6b00;
      & > span {
        display: inline-block;
      }
      .paperClip {
        margin-right: 5px;
        color: #383838;
      }
    }
    li:hover {
      background: #f9f9f9;
      & > :nth-of-type(2) {
        display: block;
      }
    }
    li > :nth-of-type(2) {
      margin-left: 12px;
      display: none;
    }
  }
}
</style>
