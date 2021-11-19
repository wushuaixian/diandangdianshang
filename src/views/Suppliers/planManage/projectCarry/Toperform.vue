<template>
  <a-card type="inner" :bordered="false">
    <div class="mid">
      <div v-if="keys == ''" class="m-bottom">
        <a-button type="primary" class="margin" @click="showModal">加入长协待下单</a-button>
        <a-button type="primary" class="margin-right">创建订单</a-button>
      </div>
      <s-table
        name="Toperform"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="init"
        :scroll="{ x: 2500, y: 300 }"
        :row-selection="rowSelection"
      >
        <a slot="translate" slot-scope>移除</a>
        <template slot="declarant">
          <input disabled="true" style="width: 100px" />
        </template>
        <template slot="authStatus">
          <input disabled="true" style="width: 40px; color: white" placeholder="不急" />
        </template>
        <template slot="company7">
          <a-input class="backInp" value="请输入" />
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
      <div v-if="keys == ''" class="m-bottom div-right">
        <a-button class="margin">取消</a-button>
        <!-- 点击弹框show -->
        <a-button type="primary" class="margin-right" @click="contract">确认全部</a-button>
      </div>
      <Popup :popupStatus="popupStatus" @close="closeExaminPopup" />
      <!-- @submitExamine="submitExamine" -->
    </div>
    <!-- 确认分配所有计划弹框 -->
    <div>
      <a-modal v-model="visible" title="提示" ok-text="确认" cancel-text="取消" @ok="hideModal">
        <p class="text">确认分配所选计划？</p>
      </a-modal>
    </div>
    <!-- 全部确认弹框 -->
    <div>
      <a-modal v-model="vis" title="提示" ok-text="确认" cancel-text="取消" @ok="hide">
        <p class="text">将当前所有采购计划物料转移至已分配？</p>
      </a-modal>
    </div>
    <!-- 调整管理员弹框 -->
    <div>
      <a-modal v-model="visibles" title="选择采购员" width="800px" ok-text="确认" cancel-text="取消" @ok="hideModals">
        <div>
          <p class="SearchName">
            <span>姓名：</span>
            <a-input class="nameSearchIpt"></a-input>
            <a-button type="danger" style="margin-left: 10px">查询</a-button>
          </p>
        </div>
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import { savePlanMatchingContract } from '@/api/buyerPlanItem'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
// import { getDistribution } from '@/api/buyerPlanItem'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '公司名称',
    dataIndex: 'corporateName',
    scopedSlots: { customRender: 'corporateName' }
  },
  {
    title: '是否紧急',
    dataIndex: 'authStatus',
    scopedSlots: { customRender: 'authStatus' }
  },
  {
    title: '采购员',
    dataIndex: 'declarant',
    scopedSlots: { customRender: 'declarant' }
  },
  {
    title: '采购计划编号',
    dataIndex: 'purchasePlanCode',
    scopedSlots: { customRender: 'purchasePlanCode' }
  },
  {
    title: '物料编码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '物料名称',
    dataIndex: 'legalPersonName',
    scopedSlots: { customRender: 'legalPersonName' }
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' }
  },
  {
    title: '计划数量',
    dataIndex: 'company2',
    scopedSlots: { customRender: 'company2' }
  },
  {
    title: '待执行数量',
    dataIndex: 'company3',
    scopedSlots: { customRender: 'company3' }
  },
  {
    title: '单位',
    dataIndex: 'company4',
    scopedSlots: { customRender: 'company4' }
  },
  {
    title: '历史单价(元)',
    dataIndex: 'company5',
    scopedSlots: { customRender: 'company5' }
  },
  {
    title: '申请组织',
    dataIndex: 'company7',
    scopedSlots: { customRender: 'company7' }
  },
  {
    title: '使用部门',
    dataIndex: 'company8',
    scopedSlots: { customRender: 'company8' }
  },
  {
    title: '备注',
    dataIndex: 'company9',
    scopedSlots: { customRender: 'company9' }
  },
  {
    title: '申报人',
    dataIndex: 'company10',
    scopedSlots: { customRender: 'company10' }
  },
  {
    title: '联系人',
    dataIndex: 'company11',
    scopedSlots: { customRender: 'company11' }
  },
  {
    title: '联系电话',
    dataIndex: 'company13',
    scopedSlots: { customRender: 'company13' }
  },
  {
    title: '原使用品牌',
    dataIndex: 'company15',
    scopedSlots: { customRender: 'company15' }
  },
  {
    title: '用途',
    dataIndex: 'company16',
    scopedSlots: { customRender: 'company16' }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'translate' }
  }
]
export default {
  components: {
    Popup,
    submitExamine
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
      state: {
        selectedRowKeys: []
      }
    }
  },
  mounted() {},
  methods: {
    async init(params) {
      // const { list } = this
      // const data = {
      //   ...params,
      //   ...list
      // }
      // retur({ ...data })
    },
    async contract() {
      const data = [
        {
          contractType: 1,
          contractCode: '456',
          contractId: 2321,
          providerMerchantId: 2106050000000085,
          contractItemId: 234234235,
          buyerUserId: null,
          buyerPlanId: 1,
          buyerPlanItemId: 1,
          buyerMerchantId: 2106050000000085,
          isInstancy: 0,
          materialId: 1,
          materialCode: '456',
          materialName: '钢铁',
          materialModel: '大',
          mpMeasurementUnit: '吨',
          matchingContractNum: 2,
          planNum: 11,
          deliverTime: 1622792847000,
          formerlyPrice: 111,
          formerlyBrand: '1',
          remark: '111',
          purpose: '收到',
          applyDepartment: '供应商',
          useDepartment: '叮当',
          declarant: '王先生',
          contact: '13331616457',
          accessoryUrl: null,
          planAuditTime: null,
          isDeleted: 0,
          versionNo: 1,
          createUserid: null,
          createUsername: 'superadmin',
          createUserip: null,
          createUsermac: null,
          createTime: null,
          createTimeDb: null,
          serverIp: '192.168.214.1',
          updateUserid: 21052612006308,
          updateUsername: 'superadmin',
          updateUserip: null,
          updateUsermac: null,
          updateTime: 1622877148000,
          updateTimeDb: null,
          clientVersionno: null,
          companyId: 2930033,
          tracesId: null,
          buyerPlanCode: null
        }
      ]

      return savePlanMatchingContract(data)
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
      this.list = {
        buyerMerchantIds: [1, 2],
        applyDepartment: '',
        buyerPlanCode: '',
        materialCode: '',
        materialName: '',
        materialModel: '',
        declarant: '',
        isInstancy: '',
        beginReviewTime: '',
        endReviewTime: '',
        status: 1,
        closeStatus: 0
      }
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
</style>
