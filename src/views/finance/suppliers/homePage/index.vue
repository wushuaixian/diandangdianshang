<template>
  <div class="home">
    <div class="title">
      <div class="title_logo">
        <img class="titleImg" :src="$$(info, 'logoUrl')" alt="" />
        <span>{{ info.enterpriseName }}</span>
        <span class="bank" @click="changeBack">银行账户{{ bankNumber }}个</span>
      </div>
      <div class="balance">
        <div class="balance_top">
          <span class="mix">叮当余额(元)</span> <br />
          <span class="maxText">{{ (titleData.balance || 0) | formatCurrency(2, true) }}</span>
        </div>
        <div class="balance_bottom">
          <div>
            <p>现金余额(元)</p>
            <p v-if="titleData.freeBalance != null">{{ (titleData.freeBalance || 0) | formatCurrency(2, true) }}</p>
            <p v-else style="height: 18px"></p>
            <p><span @click="goRecharge">充值</span><span @click="open">提现</span></p>
          </div>
          <div>
            <p class="icon">
              冻结金额(元)
              <span class="icon-span">
                <a-tooltip placement="top" title="因提现或担保支付导致的冻结金额">
                  <a-icon class="question-circle" :style="{ fontSize: '18px' }" type="question-circle" />
                </a-tooltip>
              </span>
            </p>
            <p v-if="titleData.frozenBalance != null">{{ (titleData.frozenBalance || 0) | formatCurrency(2, true) }}</p>
          </div>
          <div>
            <p>银承余额(元)</p>
            <p v-if="titleData.billBalance !== null">{{ (titleData.billBalance || 0) | formatCurrency(2, true) }}</p>
          </div>
        </div>
      </div>
      <div class="bond">
        <div>
          <span class="mix">保证金(元)</span> <br />
          <span class="maxText">{{ titleData.depositBalance | formatCurrency(2, true) }}</span>
        </div>
        <div class="balance_bottom">
          <div>
            <p>寻源保证金(元)</p>
            <p>{{ titleData.sourceDeposit | formatCurrency(2, true) }}</p>
            <p><span class="refund" @click="refund">申请退还</span></p>
          </div>
          <div>
            <p>平台保证金(元)</p>
            <p>{{ titleData.platformDeposit | formatCurrency(2, true) }}</p>
            <p>
              <span @click="Payment" v-if="$store.state.permission.isPlatform !== 7">缴纳</span>
              <span @click="bondReturn">退还</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="centralSection">
      <a-form-model layout="inline" ref="ruleForm">
        <a-row :gutter="48" type="flex" justify="start">
          <!-- <a-col :md="8" :sm="24">
            <a-form-model-item :label="type">
              <a-select allowClear class="inp" v-model="form.sceneType" :options="options" default-value=""> </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col :md="8" :sm="24">
            <a-form-model-item label="订单编号">
              <a-input v-model="form.orderNo" class="inp" placeholder="请输入订单编号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="时间">
              <a-range-picker class="inp" v-model="form.time" @change="times" />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" :sm="24" class="button">
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="search">查询</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="bottom">
      <div>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane :key="1" tab="收支明细"></a-tab-pane>
          <a-tab-pane :key="3" tab="充值明细" force-render></a-tab-pane>
          <a-tab-pane :key="2" tab="提现明细"></a-tab-pane>
          <a-tab-pane :key="4" tab="冻结明细"></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button class="button" @click="exportFile">导出</a-button>
        <a-button class="button" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table rowKey="id" ref="table" name="homePageTables" :scroll="scroll" :columns="columns" :data="init">
        <template slot="transTime" slot-scope="text">
          {{ text.transTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="balanceTransAmount" slot-scope="text">
          <!-- 2为+ 1为- -->
          <span>{{ text.balanceDcDirect == 2 ? '+' : '-' }}</span
          ><span>{{ text.balanceTransAmount }}</span>
        </template>
        <template slot="sceneType" slot-scope="text">
          <span>{{ transactionType.find((x) => x.value == text.sceneType).label }}</span>
        </template>
        <template slot="balanceAfterAmount" slot-scope="text">
          <span>{{ text.balanceAfterAmount | formatCurrency }}</span>
        </template>
        <template slot="applyTime" slot-scope="text">
          <span>{{ text.applyTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="frozenTime" slot-scope="text">
          <span>{{ text.frozenTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot-scope="text" slot="amount">
          <span>{{ text.amount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="status" slot-scope="text">
          <span>{{ recharge.find((x) => x.value == text.status).label }}</span>
        </template>
      </s-table>
    </div>
    <a-modal
      title="完善财务信息"
      :dialog-style="{ top: '20px' }"
      :visible="isShowFinanceModel"
      @cancel="isShowFinanceModel = false"
    >
      <div class="finance">银行账户未完善, 请前往<span class="text">企业信息-财务信息</span>完善相关信息</div>
      <div slot="footer">
        <a-button type="primary" @click="goEnterprise">
          <router-link :to="{ name: 'Enterprise', query: { tabsKey: '2' } }">
            去完善<a-icon type="right" />
          </router-link>
        </a-button>
      </div>
    </a-modal>
    <!-- <button>上传发票信息</button> -->
    <UploadInvoiceInfo :visible="visible" />
    <Recharge :visible.sync="rechargeVisible" @close="rechargeVisible = false" />
    <Withdrawal v-if="showWithdrawal" ref="withdrawa" />
    <Payment v-if="showWithdrawal" ref="Payment" />
    <GoActivation :visible="goActivationVisible" @Deactivation="Deactivation" @close="goActivationVisible = false" />
    <GoBankCard :visible="goBankCardVisible" />
    <Popup
      :visible="popupVisible"
      :statusNum="statusNum"
      @close="popupVisible = false"
      :getPhone="getPhone"
      @resetStatus="resetStatus"
      stop="stop"
    />
    <SingContract :visible="singContractVisible" @close="closeSingContract" :url="url" />
    <ChangeBack v-if="changeBackVisible" :visible="changeBackVisible" @close="changeBackVisible = false" />
    <BondReturn :visible="bondReturnVisible" v-if="bondReturnVisible" @close="bondReturnVisible = false" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" :taskType="taskType" />
  </div>
</template>
<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import BondReturn from './components/bondreturn'
import Popup from '@/views/finance/suppliers/paymentManagement/Popup'
import SingContract from '@/views/finance/suppliers/paymentManagement/signContract'
import UploadInvoiceInfo from './uploadInvoiceInfo'
import GoBankCard from './components/goBankCard'
import GoActivation from '@/views/Suppliers/package/goActivation'
import ChangeBack from './components/changeBank'
import {
  suppliersHomeTitle,
  tiankun,
  accountStatus,
  checkFinanceInfo,
  queryFincePhone,
  signAContract,
  paymentManagementStatus,
  queryBankNumber,
  detailedExport,
  exportId,
  validChangeBankCard
} from '@/api/fince.js'
import { transactionType, recharge } from '@/config/constant.js'
import { mapState, mapMutations } from 'vuex'
import { Recharge } from './components/'
import Withdrawal from '../../operators/homePage/components/Withdrawal.vue'
import Payment from './components/Payment.vue'
export default {
  components: {
    UploadInvoiceInfo,
    Recharge,
    Withdrawal,
    Payment,
    GoActivation,
    GoBankCard,
    Popup,
    SingContract,
    ChangeBack,
    BondReturn,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      taskType: 'incomeAndExpenditureDetailExcelExport',
      exportCode: 0,
      jsonTxt: {},
      bankNumber: 0,
      bondReturnVisible: false,
      changeBackVisible: false,
      scroll: { x: 2000 },
      popupVisible: false,
      statusNum: 1,
      getPhone: '',
      singContractVisible: false,
      CallbackStatus: null,
      status: true,
      url: '',
      showWithdrawal: false,
      goActivationVisible: false,
      goBankCardVisible: false,
      rechargeVisible: false,
      detailType: 1,
      transactionType,
      recharge,
      titleData: {
        balance: '', // 余额
        freeBalance: '', // 可用余额
        frozenBalance: '', //  冻结余额
        billBalance: '', // 银承余额
        sourceDeposit: '', // 寻源保证金，
        platformDeposit: '', // 平台保证金
        depositBalance: '' // 保证金总额
      },
      isRecharge: false,
      visible: false,
      businessLicenceUrl: '',
      isShowFinanceModel: false,
      form: {
        orderNo: '',
        sceneType: '',
        time: undefined,
        beginTime: '',
        endTime: ''
      },
      options: [],
      options2: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待支付',
          value: 1
        },
        {
          label: '付款中',
          value: 2
        },
        {
          label: '已付款',
          value: 3
        },
        {
          label: '超时',
          value: 4
        },
        {
          label: '失败',
          value: 5
        }
      ],
      options1: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '充值',
          value: 8
        },
        {
          label: '寻源保证金',
          value: 11
        },
        {
          label: '平台保证金',
          value: 13
        },
        {
          label: '套餐费',
          value: 1
        },
        {
          label: '标书费',
          value: 12
        },
        {
          label: '提现',
          value: 81
        }
      ],
      columns: [],
      columns1: [
        {
          title: '时间',
          key: 'transTime',
          scopedSlots: { customRender: 'transTime' }
        },
        {
          title: '订单编号',
          key: 'orderNo',
          dataIndex: 'orderNo'
        },
        {
          title: '支付流水',
          key: 'orderCode',
          dataIndex: 'orderCode'
        },
        {
          title: '付款单号',
          key: 'paymentBillCode',
          dataIndex: 'paymentBillCode'
        },
        {
          title: '付款单位',
          key: 'payerMerchantName',
          dataIndex: 'payerMerchantName'
        },
        {
          title: '交易类型',
          key: 'sceneType',
          scopedSlots: { customRender: 'sceneType' }
        },
        {
          title: '金额(元)',
          key: 'balanceTransAmount',
          scopedSlots: { customRender: 'balanceTransAmount' }
        },
        {
          title: '叮当余额(元)',
          key: 'balanceAfterAmount',
          scopedSlots: { customRender: 'balanceAfterAmount' }
        }
      ],
      columns2: [
        {
          title: '创建时间',
          key: 'applyTime',
          scopedSlots: { customRender: 'applyTime' }
        },
        {
          title: '订单编号',
          key: 'orderNo',
          dataIndex: 'orderNo'
        },
        {
          title: '支付流水',
          key: 'serialNumber',
          dataIndex: 'serialNumber'
        },
        {
          title: '交易类型',
          key: 'sceneType',
          scopedSlots: { customRender: 'sceneType' }
        },
        {
          title: '金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        }
        // {
        //   title: '状态',
        //   key: 'status',
        //   scopedSlots: { customRender: 'status' }
        // }
      ],
      columns3: [
        {
          title: '冻结时间',
          key: 'frozenTime',
          scopedSlots: { customRender: 'frozenTime' }
        },
        {
          title: '订单编号',
          key: 'orderCode',
          dataIndex: 'orderCode'
        },
        {
          title: '付款方',
          key: 'payerName',
          dataIndex: 'payerName'
        },
        {
          title: '交易类型',
          key: 'sceneTypeStr',
          dataIndex: 'sceneTypeStr'
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status'
        },
        {
          title: '金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    })
  },

  async created() {
    queryBankNumber().then((res) => {
      if (res.code === '0') {
        this.bankNumber = res.data
      }
    })
    const res = await checkFinanceInfo()
    if (res.code !== '0') {
      this.goBankCardVisible = true
      return
    } else {
      // 判断财务信息是否正确返回才依次渲染子组件
      this.showWithdrawal = true
    }
    this.columns = this.columns1
    // this.options = this.options1
    this.updataTitle()
    this.handleRecharge()
  },
  methods: {
    ...mapMutations(['setState']),
    queryFincePhone() {
      queryFincePhone().then((res) => {
        if (res.code === '0') {
          this.getPhone = res.data + ''
        }
      })
    },
    updataTitle() {
      let merchantType
      if (this.$hasSuppliers()) {
        merchantType = 1
      } else if (this.$hasPurcchaseers()) {
        merchantType = 2
      }
      suppliersHomeTitle({ merchantType }).then((res) => {
        this.titleData = { ...res.data }
      })
    },
    refund() {
      window.open(process.env.VUE_APP_YZB_ROLLBACK_FOUND)
    },
    goRecharge() {
      // 未激活需要跳转激活引导页面
      if (!this.isRecharge) {
        // this.$router.push({
        //   name: 'FinanceSuppliersdeactivation'
        // })
        this.goActivationVisible = true
      } else {
        this.rechargeVisible = true
      }
    },
    async handleRecharge() {
      const res = await accountStatus()
      console.log(res)
      if (res.code === '0') {
        const { password, phone, protocol } = res.data
        this.isRecharge = password && phone && protocol
      }
    },
    changeBack() {
      validChangeBankCard().then((res) => {
        if (res.code === '0') {
          this.changeBackVisible = true
        }
      })
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      let type = ''
      let name = ''
      switch (this.jsonTxt.detailType) {
        case 1:
          type = 'incomeAndExpenditureDetailExcelExport'
          name = '收支明细'
          break
        case 3:
          type = 'rechargeDetailExcelExport'
          name = '充值明细'
          break
        case 2:
          type = 'withdrawDetailExcelExport'
          name = '提现明细'
          break
        case 4:
          type = 'frozenDetailExcelExport'
          name = '冻结明细'
          break
        default:
          type = ''
          name = ''
          break
      }
      detailedExport({
        templateCode: type,
        jsonTxt,
        exportType: 'exportForfeitInfoList',
        fileName: name
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: type }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    async checkFinanceInfo() {
      const result = await checkFinanceInfo()
      if (result.code !== '0') {
        this.isShowFinanceModel = true
      }
    },
    // 保证金退还
    bondReturn() {
      this.bondReturnVisible = true
    },
    async init(params) {
      if (!this.form.orderNo) {
        this.form.orderNo = null
      }
      let status = ''
      if (this.detailType > 1) {
        status = this.form.sceneType
      }
      var data = {
        ...params,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        detailType: this.detailType,
        status: status,
        platfromOrMerchant: 1,
        sceneType: this.form.sceneType,
        orderNo: this.form.orderNo
      }
      this.jsonTxt = { ...data }
      return tiankun({ ...data })
    },
    handleReset() {
      // this.$refs.ruleForm.resetFields()
      this.form = {
        orderNo: null,
        sceneType: '',
        time: undefined,
        beginTime: '',
        endTime: ''
      }
    },
    times(v) {
      this.form.beginTime = v[0]['_d']
      this.form.endTime = v[1]['_d']
    },
    async open() {
      if (!this.isRecharge) {
        // this.$router.push({
        //   name: 'FinanceSuppliersdeactivation'
        // })
        this.Deactivation()
      } else {
        this.$refs.withdrawa.visible = true
        this.$refs.withdrawa.form.name = ''
      }

      // const result = await checkFinanceInfo()
      // if (result.code === '0') {
      //   this.$refs.withdrawa.visible = true
      //   this.$refs.withdrawa.form.name = ''
      // } else {
      //   this.isShowFinanceModel = true
      // }
    },
    Payment() {
      this.$refs.Payment.visible = true
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      switch (v) {
        case 1:
          this.taskType = 'incomeAndExpenditureDetailExcelExport'
          break
        case 3:
          this.taskType = 'rechargeDetailExcelExport'
          break
        case 2:
          this.taskType = 'withdrawDetailExcelExport'
          break
        case 4:
          this.taskType = 'frozenDetailExcelExport'
          break
        default:
          this.taskType = ''
          break
      }
      this.detailType = v
      this.form.sceneType = ''
      // v > 1 ? (this.options = this.options2) : (this.options = this.options1)
      v > 1 ? (this.columns = this.columns2) : (this.columns = this.columns1)
      if (v > 3) {
        this.scroll = {}
        this.columns = this.columns3
      } else {
        this.scroll = { x: 1500 }
      }
      this.$refs.table.refresh(true)
    },
    async goEnterprise() {
      this.$router.push({ name: 'Enterprise', query: { tabsKey: 2 } })
      // this.$router.push({ path: '/enterprise?tabsKey=2' })
    },
    // 去激活传入
    async Deactivation() {
      clearInterval(this.CallbackStatus)
      await accountStatus().then((res) => {
        if (!res.data.protocol) {
          signAContract({
            jumpUrl: 'http://www.baidu.com',
            ut: this.getcookie('ut')
          }).then((res) => {
            if (res.code === '0') {
              this.url = res.data
              this.singContractVisible = true
              this.CallbackStatus = setInterval(() => {
                accountStatus().then((res) => {
                  if (res.data.protocol) {
                    this.singContractVisible = false
                    clearInterval(this.CallbackStatus)
                    return this.Deactivation()
                  }
                })
              }, 2000)
            }
          })
        } else if (!res.data.phone) {
          paymentManagementStatus().then((res) => {
            if (res.code === '0') {
              if (res.data.phoneType === 3) {
                this.statusNum = 3
                this.popupVisible = true
              } else if (res.data.phoneType === 4) {
                this.$message.info('重新绑定手机号审核中！')
              } else if (res.data.phoneType === 5) {
                this.statusNum = 11
                this.popupVisible = true
              } else {
                this.statusNum = 1
                this.popupVisible = true
              }
            }
          })
        } else if (!res.data.password) {
          queryFincePhone().then((res) => {
            if (res.code === '0') {
              this.getPhone = res.data + ''
            }
          })
          this.statusNum = 2
          this.popupVisible = true
        } else {
          this.isRecharge = true
          this.popupVisible = false
        }
      })
    },
    getcookie(objname) {
      var arrstr = document.cookie.split('; ')
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split('=')
        if (temp[0] === objname) return unescape(temp[1])
      }
    },
    resetStatus(val) {
      if (val === 0) {
        this.Deactivation()
      }
    },
    closeSingContract() {
      this.singContractVisible = false
      clearInterval(this.CallbackStatus)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  .title {
    width: 100%;
    height: 207px;
    padding: 24px;
    background: #ffffff;
    display: flex;
    .title_logo {
      flex: 3;
      height: 100%;
      text-align: center;
      background: #f4f4f4;
      border-radius: 8px;
      margin-right: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 100px;
        height: 100px;
        vertical-align: middle;
        padding: 10px;
      }
    }
    .balance {
      flex: 4;
      height: 100%;
      background: #fff3ea;
      border-radius: 8px;
      margin-right: 12px;
      padding: 16px 25px;
      display: flex;
      flex-direction: column;
      .balance_top {
        flex: 1;
      }
      .balance_bottom {
        flex: 1;
        display: flex;
        div {
          flex: 1;
        }
      }
    }
    .bond {
      flex: 3;
      height: 100%;
      background: #fff3ea;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      padding: 16px 25px;
      .balance_bottom {
        display: flex;
        div {
          flex: 1;
        }
      }
      div {
        flex: 1;
      }
    }
  }
  .bottom {
    background: #ffffff;
  }
}
.home {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
    margin-top: 20px;
  }
  .inp {
    width: 200px;
  }
}
.centralSection {
  width: 100%;
  // height: 128px;
  background: #ffffff;
  padding: 25px;
  margin: 20px 0;
}
.icon {
  position: relative;
  .icon-span {
    position: absolute;
    left: 50;
    top: 0;
    .question-circle {
      vertical-align: center;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
.mix {
  font-size: 12px;
  color: #999999;
}
.maxText {
  font-size: 24px;
  color: #5e5750;
}
.balance_bottom {
  p {
    margin: 0;
  }
  p:nth-child(1) {
    font-size: 12px;
    color: #999999;
  }
  p:nth-child(2) {
    font-size: 16px;
    color: #5e5750;
  }
  p:nth-child(3) {
    span {
      color: #ff6b00;
      cursor: pointer;
    }
    span:nth-child(2) {
      margin-left: 10px;
    }
  }
}
.finance {
  padding: 20px 50px;
  text-align: center;
  .text {
    color: #ff6b00;
  }
}
.titleImg {
  border-radius: 50%;
}
.refund {
  cursor: pointer;
}
.bank {
  color: #ff6b00;
  cursor: pointer;
}
.export {
  margin-bottom: 10px;
}
.buttonAraay {
  margin-top: -20px;
  margin-bottom: 10px;
  .button {
    width: 100px;
    margin-right: 10px;
  }
}
</style>
