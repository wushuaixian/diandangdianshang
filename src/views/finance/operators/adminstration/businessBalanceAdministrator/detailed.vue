<template>
  <div class="home">
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
          ><span>{{ text.balanceTransAmount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="sceneType" slot-scope="text">
          <span>{{ transactionType.find((x) => x.value == text.sceneType).label }}</span>
        </template>
        <template slot="balanceAfterAmount" slot-scope="text">
          <span>{{ text.balanceAfterAmount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="applyTime" slot-scope="text">
          <span>{{ text.applyTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="frozenTime" slot-scope="text">
          <span>{{ text.frozenTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot-scope="text" slot="amount">
          <span v-if="text.amount">{{ text.amount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="status" slot-scope="text">
          <span>{{ recharge.find((x) => x.value == text.status).label }}</span>
        </template>
      </s-table>
    </div>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" :taskType="taskType" />
  </div>
</template>
<script>
import { tiankun, detailedExport, exportId } from '@/api/fince.js'
import { transactionType, recharge } from '@/config/constant.js'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      changeBackVisible: false,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      scroll: { x: 2000 },
      popupVisible: false,
      taskType: 'platformIncomeAndExpenditureDetailExcelExport',
      jsonTxt: {},
      statusNum: 1,
      type: '交易类型',
      singContractVisible: false,
      CallbackStatus: null,
      status: true,
      url: '',
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
          title: '金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        }
      ]
    }
  },
  computed: {},

  async created() {
    this.columns = this.columns1
    this.options = this.options1
  },
  methods: {
    async init(params) {
      console.log(this.$route.params)
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
        merchantId: this.$route.params.merchantId,
        sceneType: this.form.sceneType,
        orderNo: this.form.orderNo
      }
      this.jsonTxt = { ...data }
      return tiankun({ ...data })
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
          type = 'platformIncomeAndExpenditureDetailExcelExport'
          name = '收支明细'
          break
        case 3:
          type = 'platformRechargeDetailExcelExport'
          name = '充值明细'
          break
        case 2:
          type = 'platformWithdrawDetailExcelExport'
          name = '提现明细'
          break
        case 4:
          type = 'platformFrozenDetailExcelExport'
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
        merchantId: this.$route.params.merchantId,
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
          this.taskType = 'platformIncomeAndExpenditureDetailExcelExport'
          break
        case 3:
          this.taskType = 'platformRechargeDetailExcelExport'
          break
        case 2:
          this.taskType = 'platformWithdrawDetailExcelExport'
          break
        case 4:
          this.taskType = 'platformFrozenDetailExcelExport'
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
    goEnterprise() {
      this.$router.push({
        name: 'Enterprise'
      })
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
.buttonAraay {
  margin-bottom: 10px;
  .button {
    margin-right: 10px;
  }
}
</style>
