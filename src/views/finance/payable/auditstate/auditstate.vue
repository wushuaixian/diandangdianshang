<template>
  <div id="paymentDetails">
    <a-card style="height: 321px; margin-top: 0">
      <header-title class="header-title">
        <span>应付单全流程跟踪</span>
      </header-title>
      <a-row class="state">
        <a-col v-if="data.billStatus === 1" :span="5" class="state_left">
          <h3 class="titleTips">等待采购方内部审核</h3>
          <p>状态</p>
          <h4>待审核</h4>
        </a-col>
        <a-col v-if="data.billStatus === 7" :span="5" class="state_left">
          <h3 class="titleTips">财务已线下打款，待收款单位确认</h3>
          <p>状态</p>
          <h4>待确认</h4>
        </a-col>
        <a-col v-if="data.billStatus === 4" :span="5" class="state_left">
          <h3 class="titleTips">
            付款单审批失败，请重新申请<span v-if="data.sceneType !== 16 || data.sceneType !== 12">或作废</span>
          </h3>
          <p>状态</p>
          <h4>付款审批不通过</h4>
          <div style="margin-top: 30px">
            <a-button type="primary" class="but_right" @click="payment">申请付款</a-button>
            <a-button
              @click="toVoid(data)"
              v-if="data.sceneType !== 16 && data.sceneType !== 12"
              style="margin-left: 10px"
            >
              作废</a-button
            >
          </div>
        </a-col>
        <a-col v-if="data.billStatus === 3" :span="5" class="state_left">
          <h3 class="titleTips">应付单已审核通过，请立即申请付款</h3>
          <p>状态</p>
          <h4>待申请付款</h4>
          <div style="margin-top: 30px">
            <a-button class="but_left" v-if="data.billStatus == 15" @click="toVoid(data)">作废</a-button>
            <a-button type="primary" class="but_right" @click="payment">申请付款</a-button>
          </div>
        </a-col>

        <a-col v-if="data.billStatus === 5" :span="5" class="state_left">
          <h3 class="titleTips">已经提交付款单审批，等待财务审批结果</h3>
          <p>状态</p>
          <h4>已申请待审批</h4>
        </a-col>
        <a-col v-if="data.billStatus === 6" :span="5" class="state_left">
          <h3 class="titleTips">付款单审批通过，财务操作打款</h3>
          <p>状态</p>
          <h4>付款中</h4>
        </a-col>
        <a-col v-if="data.billStatus === 8" :span="5" class="state_left">
          <h3 class="titleTips">财务完成打款，应付单完成</h3>
          <p>状态</p>
          <h4>已完成</h4>
        </a-col>
        <a-col v-if="data.billStatus === 9" :span="5" class="state_left">
          <h3 class="titleTips">应付单作废，已关闭</h3>
          <p>状态</p>
          <h4>已关闭</h4>
        </a-col>
        <a-col v-if="data.billStatus === 2" :span="5" class="state_left">
          <p>状态</p>
          <h4>审核不通过</h4>
          <!-- <p>原因：付款单关闭，可重新申请付款</p>
          <p>付款单关闭，可重新申请付款...</p>
          <div>
            <a-button class="but_left" @click="toVoid">作废</a-button>
            <a-button type="primary" class="but_right" @click="payment">申请付款</a-button>
          </div> -->
        </a-col>
        <a-col :span="18" class="state_right">
          <div>
            <Steps :list="stepsList" :status="String(billStatus)" />
          </div>
          <div>
            <a-row>
              <p>
                <span>应付单号:</span>
                <span class="margin">{{ data.feeBillCode }}</span>
              </p>
              <a-col :span="10">
                <p>
                  <span>创建时间:</span>
                  <span class="margin">{{ data.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                </p>
                <p>
                  <span>交易类型:</span>
                  <span class="margin" v-show="data.sceneType == 1">套餐费</span>
                  <span class="margin" v-show="data.sceneType == 11">寻源保证金缴纳</span>
                  <span class="margin" v-show="data.sceneType == 12">标书费</span>
                  <span class="margin" v-show="data.sceneType == 13">平台保证金缴纳</span>
                  <span class="margin" v-show="data.sceneType == 14">寻源保证金退还</span>
                  <span class="margin" v-show="data.sceneType == 15">平台保证金退还</span>
                  <span class="margin" v-show="data.sceneType == 16">罚款</span>
                </p>
              </a-col>
              <a-col :span="11">
                <p>
                  <span>应付金额:</span>
                  <span class="margin">{{ data.feeAmt | formatCurrency(2, true) }}元</span>
                </p>
                <p>
                  <span>摘要: </span>
                  <span class="margin">{{ data.summary }}</span>
                </p>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <header-title class="header-title">
        <span>应付单审批流</span>
      </header-title>
      <a-row class="process">
        <a-col :span="5">
          <div class="left">
            <div class="left_1">
              <p>状态</p>
              <h3>
                {{ data && data.billStatus ? typeList.find((item) => item.value == data.billStatus).label : '' }}
              </h3>
              <!-- <p>已经核对账户信息,结算明细</p> -->
              <!-- <p v-if="data.billStatus !== 2">审核人:{{ reviewer }}</p>
              <p v-else>审核不通过原因: 审核不通过,应付申请关闭,请重新申请</p> -->
              <p v-if="data.billStatus === 2">
                <a-button @click="relaunch">重新提交</a-button
                ><a-button @click="toVoid(data)" style="margin-left: 10px">作废</a-button>
              </p>
            </div>
          </div>
        </a-col>
        <a-col :span="18">
          <div class="right">
            <a-row class="right_line">
              <a-col :span="12">
                <h4>付款单位信息</h4>
                <a-row class="right_top">
                  <p>
                    <span>公司名称:</span>
                    <span class="margin">{{ data.payerAccountName }}</span>
                  </p>
                  <p>
                    <span>开户银行:</span>
                    <span class="margin">{{ data.payerBankName }}</span>
                  </p>
                  <p>
                    <span>账户名称:</span>
                    <span class="margin">{{ data.payerAccountName }}</span>
                  </p>
                  <p>
                    <span>银行账号:</span>
                    <span class="margin">{{ data.payerAccountNo }}</span>
                  </p>
                </a-row>
              </a-col>
              <a-col :span="11">
                <h4>收款单位信息</h4>
                <a-row class="right_top">
                  <p>
                    <span>公司名称:</span>
                    <span class="margin">{{ data.payeeAccountName }}</span>
                  </p>
                  <p>
                    <span>开户银行:</span>
                    <span class="margin">{{ data.payeeBankName }}</span>
                  </p>
                  <p>
                    <span>账户名称:</span>
                    <span class="margin">{{ data.payeeAccountName }}</span>
                  </p>
                  <p>
                    <span>银行账号:</span>
                    <span class="margin">{{ data.payeeAccountNo }}</span>
                  </p>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <Totaling ref="totaling" @getList="BindData" />
    <Audit ref="audit" @getList="BindData" />
    <RelaunchPopup :visible="relaunchPopupVisible" @okRelaunch="okRelaunch" @close="relaunchPopupVisible = false" />
    <appdflow-progress ref="progress" @changeList="getReviewer" :typeCode="typeCode" :bizCode="data.feeBillCode" />
  </div>
</template>

<script>
import { getAuditstate } from '@/api/auditstate'
import swiperList from '@/components/SwiperList/swiperList.vue'
import ImagePreview from '@/components/ImagePreview'
import RelaunchPopup from '@/views/finance/payable/custom/components/relaunchPopup'
import { Totaling, Audit } from '../custom/components'
import { Steps } from '@/components/Steps'
import { PayableRelaunch } from '@/api/fince'
export default {
  components: { swiperList, ImagePreview, Steps, Totaling, Audit, RelaunchPopup },
  data() {
    return {
      list: [],
      data: '',
      reviewer: '',
      billStatus: '',
      typeCode: '',
      stepsList: [
        { label: '待审核', value: '1' },
        { label: '待申请付款', value: '3' },
        { label: '已申请待审批', value: '5' },
        { label: '付款中', value: '6' },
        { label: '已完成', value: '8' }
      ],
      relaunchPopupVisible: false,
      typeList: [
        { label: '待审核', value: '1' },
        { label: '审核不通过', value: '2' },
        { label: '付款审批不通过', value: '4' },
        { label: '待申请付款', value: '3' },
        { label: '已申请待审批', value: '5' },
        { label: '待确认', value: '7' },
        { label: '付款中', value: '6' },
        { label: '已完成', value: '8' },
        { label: '已关闭', value: '9' }
      ]
    }
  },
  created() {
    //     purchase_fee_bill：采购方应付单
    // purchase_payment_bill:采购方付款单
    // plat_fee_bill:运营方应付单
    // plat_payment_bill:运营方付款单
    this.BindData()
    if (this.$hasOpeerate()) {
      this.typeCode = 'plat_fee_bill'
    } else {
      this.typeCode = 'purchase_fee_bill'
    }
  },
  mounted() {},
  watch: {},
  methods: {
    getReviewer(v) {
      this.reviewer =
        v.length > 1 && v[1].subtaskList.length > 1 && v[1].subtaskList.length > 1
          ? v[1].subtaskList[1].auditUsername
          : '系统'
    },
    async BindData() {
      // const { data } = await getAuditstate(8)
      const { data } = await getAuditstate(this.$route.params.id)
      this.data = data
      this.billStatus = data.billStatus
    },
    payment() {
      this.$refs['totaling'].init(this.data)
    },
    relaunch() {
      this.relaunchPopupVisible = true
    },
    okRelaunch() {
      PayableRelaunch({ id: this.$route.params.id }).then((res) => {
        if (res.code === '0') {
          this.$message.success('重新提交成功')
          this.relaunchPopupVisible = false
          this.BindData()
        }
      })
    },
    // 作废
    toVoid(data) {
      this.$refs['audit'].init(data)
    }
  }
}
</script>

<style lang="less" scoped>
#paymentDetails {
  .ant-card {
    margin-top: 15px;
    border: none;
    border-radius: 10px;
  }
  .header-title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #262626;
    line-height: 20px;
    font-weight: bold;
    height: 32px;
  }
  .state {
    .state_left {
      text-align: center;
      margin-top: 50px;
      // border-right: 1px solid #f1f2f5;
      & > P {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        text-align: center;
        line-height: 18px;
      }
      h4 {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ff6700;
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
      }
      & > div {
        width: 100%;
        .but_left {
          margin-left: 10px !important;
          width: 80px;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          color: #262626;
          margin-right: 20px;
        }
      }
    }
    .state_right {
      border-left: 1px solid #f1f2f5;
      margin-top: 20px;
      padding-left: 44px;
      & > :nth-of-type(1) {
        margin-top: 30px;
      }
      & > :nth-of-type(2) {
        margin-top: 30px;
        .ant-row {
          & > p {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #262626;
            letter-spacing: 0;
            line-height: 18px;
            font-weight: bold;
          }
          .ant-col {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #262626;
            line-height: 18px;
          }
        }
      }
    }
  }
  .margin {
    margin-left: 8px;
  }
  .process {
    .left {
      text-align: center;
      margin-top: 24px;
      .left_1 {
        & > p {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          line-height: 18px;
        }
        & > :nth-of-type(2) {
          margin-top: 16px;
        }
        & > p :nth-of-type(3) {
          margin-top: 8px;
        }
        h3 {
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #262626;
          letter-spacing: 0;
          text-align: center;
          line-height: 24px;
          font-weight: bold;
        }
      }
    }
  }
  .right {
    margin-top: 24px;
    padding-top: 10px;
    border-left: 1px solid #f1f2f5;
    padding-left: 44px;
    .right_top {
      margin-top: 24px;
    }
    .ant-col {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #262626;
      line-height: 18px;
    }
    .ant-row {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #262626;
      line-height: 18px;
    }
  }
  h4 {
    font-weight: 600;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #262626;
    line-height: 20px;
    font-weight: bold;
  }
  .ant-row {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    line-height: 18px;
  }
  .settlement {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    line-height: 18px;
    font-weight: 400;
    margin-top: 24px;
  }
}
.titleTips {
  font-weight: 600;
}
</style>
