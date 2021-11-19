<template>
  <div class="is-tribution">
    <a-card type="inner" :bordered="false">
      <a-tabs v-model="active" @change="handleTbasChange" type="card">
        <a-tab-pane :key="1" :tab="`待分配(${$$(countInfo, 'pendingDispatch') || 0})`"> </a-tab-pane>
        <a-tab-pane :key="2" :tab="`已分配(${$$(countInfo, 'dispatched') || 0})`"></a-tab-pane>
        <a-tab-pane :key="3" :tab="`已关闭(${$$(countInfo, 'dispatchClosed') || 0})`"></a-tab-pane>
      </a-tabs>
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="params"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <d-select
                  mode="multiple"
                  :allowClear="false"
                  v-model="params.buyerMerchantIds"
                  :options="merchantList"
                ></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="申请组织" prop="applyDepartment">
                <a-input v-model="params.applyDepartment" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购申请编号" prop="buyerPlanCode">
                <a-input v-model="params.buyerPlanCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编码" prop="materialCode">
                <a-input v-model="params.materialCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="materialName">
                <a-input v-model="params.materialName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="materialModel">
                <a-input v-model="params.materialModel" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="active === 1">
              <a-form-model-item label="申报人" prop="declarant">
                <a-input v-model="params.declarant" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="active !== 1">
              <a-form-model-item label="采购员" prop="buyerUserName">
                <a-input v-model="params.buyerUserName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="是否紧急" prop="isInstancy">
                <d-select v-model="params.isInstancy" :options="instancyList"> </d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="params.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="计划编号" prop="planItemCode">
                <a-input v-model="params.planItemCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="计划项目编码" prop="planProjectItemCode">
                <a-input v-model="params.planProjectItemCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="计划项目名称" prop="planProjectItemName">
                <a-input v-model="params.planProjectItemName" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="table-page-search-submitButtons">
            <a-button class="middleBtn" @click="Reset">重置</a-button>
            <a-button type="primary" class="search" @click="search">查询</a-button>
          </div>
        </a-form-model>
      </div>
    </a-card>
    <a-card type="inner" :bordered="false">
      <div class="contest">
        <div v-if="active === 1" class="buttons">
          <a-button type="primary" class="margin" @click="onec"> 一键分配所有计划 </a-button>
          <a-button type="custom" class="margin-right" @click="handleShowBuyer">手动分配计划 </a-button>
          <export-file :params="exportParams" />
        </div>
        <div v-else-if="active === 2" class="buttons">
          <a-button type="primary" class="margin" @click="handleShowBuyer"> 调整采购员 </a-button>
          <a-button type="custom" class="margin-right" @click="handleMoveToAllocated"> 移至待分配 </a-button>
          <export-file :params="exportParams" />
        </div>
        <s-table
          v-if="params.buyerMerchantIds.length > 0"
          ref="table"
          rowKey="id"
          name="istrbutionTable"
          :pageSizeOptions="['30', '50', '100', '200', '300']"
          :pageSize="30"
          :columns="columns"
          :data="init"
          :scroll="{ x: 3200, y: 300 }"
          :row-selection="{
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.selectedRowKeys = selectedRowKeys
              this.selectedRows = selectedRows
            }
          }"
        >
          <template v-slot:action="props">
            <a v-if="props.status === 1 && props.closeStatus === 0" type="link" @click="handleClose(props)"> 关闭</a>
          </template>
          <template v-slot:auditTime="auditTime">
            {{ auditTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:closeTime="closeTime">
            {{ closeTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </s-table>
      </div>
    </a-card>

    <AutoDistribution
      :visible.sync="showAutoModl"
      :merchantId="params.buyerMerchantIds[0]"
      :list="distributinoList"
      @ok="handleAutoOk"
    />
    <BuyerTable
      @ok="handleBuyerChange"
      :visible.sync="showBuyer"
      :merchantId="params.buyerMerchantIds[0]"
      :parentKeys="selectedRowKeys"
    />
    <CloseModal :visibleClose.sync="showClose" :id="itemId" @ok="visibleClose" />
  </div>
</template>

<script>
import {
  getDistribution,
  distributionPlan,
  buyerChange,
  getCountPendingDispatch,
  confirmAllocation
} from '@/api/buyerPlanItem'
import { getSupplierMerchant } from '@/api/projectCarry'
import { instancyList } from '@/config/constant'
import { AutoDistribution, BuyerTable, CloseModal } from './components/'
import ExportFile from '@/components/exportFile/'

const columns = [
  {
    title: '序号',
    key: 'name',
    fixed: 'left',
    customRender: (text, record, index) => {
      return index + 1
    },
    show: true
  },
  { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName', show: true },
  { title: '公司名称', dataIndex: 'buyerMerchantName', key: 'buyerMerchantName', show: true },
  {
    title: '是否紧急',
    key: 'isInstancy',
    dataIndex: 'isInstancy',
    customRender: (text) => {
      return instancyList.find((x) => x.value === text)?.label
    },
    show: true
  },
  { title: '采购申请编号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode', show: true },
  { title: '计划编号', dataIndex: 'planItemCode', key: 'planItemCode', show: true },
  { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode', show: true },
  { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
  { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', show: true },
  { title: '计划数量', dataIndex: 'planNum', key: 'planNum', show: true },
  { title: '待执行数量', dataIndex: 'executoryNum', key: 'executoryNum', show: true },
  { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit', show: true },
  { title: '申请组织', dataIndex: 'applyDepartment', key: 'applyDepartment', show: true },
  { title: '使用部门', dataIndex: 'useDepartment', key: 'useDepartment', show: true },
  { title: '申报人', dataIndex: 'declarant', key: 'declarant', show: true },
  { title: '联系电话', dataIndex: 'contact', key: 'contact', show: true },
  { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand', show: true },
  { title: '用途', dataIndex: 'purpose', key: 'purpose', show: true },
  { title: '历史单价(元)', dataIndex: 'formerlyPrice', key: 'formerlyPrice', show: true },
  { title: '备注', dataIndex: 'remark', key: 'remark', show: true },
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    key: 'auditTime',
    width: 160,
    scopedSlots: { customRender: 'auditTime' },
    show: true
  },
  { title: '计划项目编码', dataIndex: 'planProjectItemCode', key: 'planProjectItemCode', show: true },
  { title: '计划项目名称', dataIndex: 'planProjectItemName', key: 'planProjectItemName', show: true },
  { title: '状态', dataIndex: 'statusStr', key: 'statusStr', show: true },
  { title: '关闭原因', dataIndex: 'applyCloseReason', key: 'applyCloseReason', show: false },
  { title: '关闭人', dataIndex: 'closeUserName', key: 'closeUserName', show: false },
  {
    title: '关闭时间',
    dataIndex: 'closeTime',
    key: 'closeTime',
    width: 200,
    show: false,
    scopedSlots: {
      customRender: 'closeTime'
    }
  },
  {
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' },
    show: true
  }
]
export default {
  components: {
    AutoDistribution,
    BuyerTable,
    CloseModal,
    ExportFile
  },
  data() {
    return {
      columns,
      // 表头
      active: 1,
      instancyList,
      getMerchant: [],
      selectedRowKeys: [],
      selectedRows: [],
      params: {
        buyerMerchantIds: [],
        applyDepartment: '',
        buyerPlanCode: '',
        materialCode: '',
        buyerUserName: '',
        materialName: '',
        materialModel: '',
        declarant: '',
        isInstancy: '',
        beginReviewTime: '',
        endReviewTime: '',
        status: 1,
        closeStatus: 0
      },
      merchantList: [],
      countInfo: {},
      distributinoList: [],
      showAutoModl: false,
      showBuyer: false,
      itemId: null,
      showClose: false,
      countKey: ['', 'pendingDispatch', 'dispatched', 'dispatchClosed'],
      exportParams: {
        templateCode: 'buyerPlanItemDispatchExport',
        jsonTxt: {},
        exportType: 'exportBuyerPlanItemDispatchList',
        fileName: '采购计划分配列表'
      }
    }
  },
  mounted() {
    this.SupplierMerchant()
    this.getCountPendingDispatch()
  },
  methods: {
    async getCountPendingDispatch() {
      const res = await getCountPendingDispatch()
      if (res.code === '0') {
        this.countInfo = res.data
      }
    },
    // 获取采购商id
    async SupplierMerchant() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        const [item] = res?.data
        this.merchantList = res?.data.map((x) => {
          return {
            value: x.merchantId,
            label: x.merchantName
          }
        })
        this.params.buyerMerchantIds = [item?.merchantId]
      }
    },
    handleTbasChange(val) {
      this.selectedRowKeys = []
      this.$refs.form.resetFields()
      if (val === 3) {
        this.params.status = 1
        this.params.closeStatus = 1
        this.countInfoText = 'dispatchClosed'
        this.columns = this.columns.filter((item) => {
          item.show = true
          if (item.title === '状态') {
            item.show = false
          }
          return item
        })
      } else if (val === 2) {
        this.params.status = val
        this.params.closeStatus = 0
        this.countInfoText = 'dispatched'
        this.columns = this.columns.filter((item) => {
          if (
            item.title === '状态' ||
            item.title === '关闭原因' ||
            item.title === '关闭人' ||
            item.title === '关闭时间'
          ) {
            item.show = false
          }
          return item
        })
      } else {
        this.params.status = val
        this.params.closeStatus = 0
        this.countInfoText = 'pendingDispatch'
        this.columns = this.columns.filter((item) => {
          if (item.title === '关闭原因' || item.title === '关闭人' || item.title === '关闭时间') {
            item.show = false
          }
          if (item.title === '状态') {
            item.show = true
          }
          return item
        })
      }
      this.$refs.form.resetFields()
      this.search()
    },
    // 列表请求
    async init(page) {
      const { params, countKey, active } = this
      const data = {
        ...page,
        ...params
      }
      if (data.time) {
        const [createDateStartTime, createDateEndTime] = data.time
        data.createStartTime = createDateStartTime
        data.createEndTime = createDateEndTime
      }
      this.exportParams.jsonTxt = {
        ...data
      }
      const result = await getDistribution({ ...data })
      this.countInfo[countKey[active]] = result.data.total || 0
      return result
    },
    // 移至待分配
    async handleMoveToAllocated() {
      const { selectedRows, selectedRowKeys: buyerPlanItemId, selectedRowKeys } = this
      if (selectedRowKeys?.length <= 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      if (
        selectedRows.some((item) => {
          return item.executoryNum < item.planNum
        })
      ) {
        this.$message.warning('待执行数量小于计划数量不能移至待分配')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定要移至待分配?',
        onOk: async () => {
          const res = await buyerChange({ buyerPlanItemId })
          if (res.code === '0') {
            this.$message.success('操作成功')
            this.$refs.form.resetFields()
            this.search()
            this.getCountPendingDispatch()
          }
        }
      })
    },
    handleShowBuyer() {
      const { selectedRows, selectedRowKeys } = this
      if (selectedRowKeys.length <= 0) {
        this.$message.warning('请选择至少一条计划')
        return
      }
      const buyerMerchantId = Array.from(new Set(selectedRows.map((x) => x.buyerMerchantId)))
      if (buyerMerchantId.length > 1) {
        this.$message.warning('只能选择一家公司才可以分配计划')
        return
      }
      this.showBuyer = true
    },
    // 一键分配所有计划
    async onec() {
      const { params, selectedRows } = this

      const buyerMerchantId = Array.from(new Set(selectedRows.map((x) => x.buyerMerchantId)))
      if (buyerMerchantId.length > 1) {
        this.$message.warning('只能选择一家公司才可以分配计划')
        return
      }

      const res = await distributionPlan(params)
      if (res.code === '0') {
        this.distributinoList = res.data
        this.showAutoModl = true
      }
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    // 重置查询数据
    Reset() {
      this.$refs.form.resetFields()
      this.SupplierMerchant()
    },
    async handleBuyerChange({ parentKeys, selectRows: [buyer] }) {
      const data = parentKeys.map((x) => {
        return {
          id: x,
          buyerUserId: buyer?.id
        }
      })
      const res = await confirmAllocation(data)
      if (res.code === '0') {
        this.$message.success('分配成功')
        this.getCountPendingDispatch()
        this.search()
      }
    },
    async handleClose({ id }) {
      this.showClose = true
      this.itemId = id
    },
    visibleClose() {
      this.showClose = false
      this.search()
      this.getCountPendingDispatch()
    },
    handleAutoOk() {
      this.search()
      this.getCountPendingDispatch()
    }
  }
}
</script>
<style lang="less" scoped>
.is-tribution {
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .table-page-search-submitButtons {
    text-align: center;
  }
  .buttons {
    margin-bottom: 20px;
    .exportFile {
      margin-left: 16px;
    }
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border-top: 2px solid #ff6b00;
    height: 50px;
    color: #ff6b00;
  }
}
</style>
