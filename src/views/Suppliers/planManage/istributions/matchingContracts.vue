<template>
  <a-card type="inner" :bordered="false">
    <div class="mid">
      <div v-if="keys == ''" class="m-bottom">
        <a-button type="primary" class="margin"> 加入合同待下单 </a-button>
        <!-- <a-button type="primary" class="margin-right">创建订单 </a-button> -->
      </div>
      <s-table
        class="table"
        ref="table"
        name="matchingContractsTable"
        rowKey="id"
        :columns="columns"
        :data="init"
        :scroll="{ x: 2500, y: 300 }"
        :row-selection="rowSelection"
      >
        <a slot="translate" slot-scope="">移除</a>
        <template slot="company7">
          <a-input class="backInp" value="请选择" @click="changeInput" />
        </template>
        <template slot="company11">
          <a-input />
        </template>
        <template slot="company13">
          <a-input value="10" />
        </template>
        <template slot="company15">
          <a-date-picker @change="onChange" />
        </template>
        <template slot="company16">
          <a-input />
        </template>
      </s-table>
      <Popup :popupStatus="popupStatus" @close="closeExaminPopup" />
      <!-- @submitExamine="submitExamine" -->
      <Choice :inputChanges="inputChange"></Choice>
    </div>
  </a-card>
</template>
<script>
import { supplierAuditList } from '@/api/supplier'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
import Choice from '@/views/Suppliers/authention/istributions/choice'
const columns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '物料编码',
    key: 'corporateName',
    dataIndex: 'corporateName',
    scopedSlots: { customRender: 'corporateName' }
  },
  {
    title: '物料名称',
    key: 'authStatus',
    dataIndex: 'authStatus',
    scopedSlots: { customRender: 'authStatus' }
  },
  {
    title: '规格型号',
    key: 'declarant',
    dataIndex: 'declarant',
    scopedSlots: { customRender: 'declarant' }
  },
  {
    title: '计划数量',
    key: 'purchasePlanCode',
    dataIndex: 'purchasePlanCode',
    scopedSlots: { customRender: 'purchasePlanCode' }
  },
  {
    title: '待执行数量',
    key: 'materialCode',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '单位',
    key: 'legalPersonName',
    dataIndex: 'legalPersonName',
    scopedSlots: { customRender: 'legalPersonName' }
  },
  {
    title: '历史单位',
    key: 'specification',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' }
  },
  {
    title: '申请组织',
    key: 'company2',
    dataIndex: 'company2',
    scopedSlots: { customRender: 'company2' }
  },
  {
    title: '备注',
    key: 'company3',
    dataIndex: 'company3',
    scopedSlots: { customRender: 'company3' }
  },
  {
    title: '原使用品牌',
    key: 'company4',
    dataIndex: 'company4',
    scopedSlots: { customRender: 'company4' }
  },
  {
    title: '供应商',
    key: 'company5',
    dataIndex: 'company5',
    scopedSlots: { customRender: 'company5' }
  },
  {
    title: '合同编号',
    key: 'company7',
    dataIndex: 'company7',
    scopedSlots: { customRender: 'company7' }
  },
  {
    title: '合同类型',
    key: 'company8',
    dataIndex: 'company8',
    scopedSlots: { customRender: 'company8' }
  },
  {
    title: '是否框架合同',
    key: 'company9',
    dataIndex: 'company9',
    scopedSlots: { customRender: 'company9' }
  },
  {
    title: '截止日期',
    key: 'company10',
    dataIndex: 'company10',
    scopedSlots: { customRender: 'company10' }
  },
  {
    title: '含税单价(元)',
    key: 'company11',
    dataIndex: 'company11',
    scopedSlots: { customRender: 'company11' }
  },
  {
    title: '下单数量',
    key: 'company13',
    dataIndex: 'company13',
    scopedSlots: { customRender: 'company13' }
  },
  {
    title: '交货日期',
    key: 'company15',
    dataIndex: 'company15',
    scopedSlots: { customRender: 'company15' }
  },
  {
    title: '质保期',
    key: 'company16',
    dataIndex: 'company16',
    scopedSlots: { customRender: 'company16' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'translate' }
  }
]
export default {
  components: {
    Popup,
    submitExamine,
    Choice
  },
  data() {
    this.columns = columns
    return {
      timedata: [],
      idList: [],
      popupStatus: false,
      // data: [],
      visible: false,
      visibles: false,
      vis: false,
      keys: '',
      columns,
      list: {},
      inputChange: false,
      state: {
        selectedRowKeys: []
      }
    }
  },
  mounted() {},
  methods: {
    async init(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      return supplierAuditList({ ...data })
    },
    async choiceList() {
      // const { list } = this
      // const data = {
      //   ...params,
      //   ...list
      // }
      return 1
    },
    closeExaminPopup() {
      this.popupStatus = false
    },
    // 显示手动分配计划弹框
    showModal() {
      this.visible = true
    },
    // 隐藏手动分配计划弹框
    hideModal() {
      this.visible = false
    },
    // 显示一键分配
    showModals() {
      this.visibles = true
    },
    // 隐藏一键分配
    hideModals() {
      this.visibles = false
    },
    // 显示确认全部
    show() {
      this.vis = true
    },
    // 显示确认全部
    hide() {
      this.vis = false
    },
    // 显示确认全部
    changeInput() {
      this.inputChange = true
    },
    callback(v) {
      console.log(v)
      this.keys = v
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    // 获取查询时间
    onChange(date, dateString) {
      this.list.beginTime = dateString[0]
      this.list.endTime = dateString[1]
    },
    // 重置查询数据
    Reset() {
      this.timedata = []
      this.list = {}
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      const { selectedRowKeys } = that.state
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.state.selectedRowKeys = selectedRowKeys
          that.idList = selectedRowKeys
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  .margin {
    width: auto;
    margin-right: 15px;
    margin-top: 15px;
  }
  .table {
    margin-bottom: 20px;
  }
  .m-bottom {
    margin-bottom: 15px;
  }
  .margin-right {
    margin-right: 15px;
  }
  .div-right {
    float: right;
  }
}
.text {
  text-align: center;
}
.SearchName {
  text-align: center;
  display: flex;
  align-items: center;
  span {
    margin-left: 60px;
  }
  .nameSearchIpt {
    width: 300px;
  }
}
.backInp {
  background: #f2f2f2;
}
</style>
