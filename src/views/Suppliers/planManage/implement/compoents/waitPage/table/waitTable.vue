<template>
  <div class="wait-table">
    <div class="buttons">
      <div v-if="implementActive === 0">
        <a-button type="primary" @click="handleMapping">一键匹配长协</a-button>
        <a-button type="custom" @click="toMatchContract"> 手动匹配合同 </a-button>
        <a-button type="custom" @click="goMerchantsPurchaseManagFoundSearch">创建寻源</a-button>
        <!-- <a-button type="custom">匹配商城商品</a-button> -->
        <a-button type="custom" @click="goContractPurchaseAddcontract">创建合同</a-button>
        <a-button type="custom" @click="createOrder">创建订单</a-button>
        <a-button @click="returnToDistributor">退回分配人</a-button>
        <a-button @click="transferToLetPeople">转给他人</a-button>
      </div>
      <ExportFile :params="exportParams" />
      <!-- <a-button>导出</a-button> -->
    </div>
    <s-table
      name="waitTable"
      ref="table"
      rowKey="id"
      v-if="loading"
      :pageSizeOptions="['30', '50', '100', '200', '300']"
      :pageSize="30"
      :row-selection="rowSelection"
      :data="getList"
      :columns="columns"
      :scroll="{ x: 3200, y: 500 }"
    >
      <template v-slot:auditTime="auditTime">
        {{ auditTime | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-slot:action="props">
        <div v-if="!props.closeStatus">
          <a href="javascript:;" @click="closeBtn(props)"> 关闭 </a>
        </div>
      </template>
      <template v-slot:closeTime="closeTime">
        {{ closeTime | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </s-table>
    <transferToLetPeople
      ref="transferToLetPeople"
      :visible="visibleBuyerInfo"
      :selectedRowKeys="selectedRowKeys"
      :selectedRows="selectedRows"
      @updateVisible="updateVisible"
    >
    </transferToLetPeople>
    <MappingTable :visible.sync="visible" :params="queryParam" @ok="hanldleMappingok" />
    <closeBtn :visibleClose.sync="visibleClose" :id="applyCloseReasonId" @updateVisibleClose="updateVisibleClose" />
  </div>
</template>

<script>
import { queryBuyerPlanProcessPage, buyerChange } from '@/api/projectCarry'
import { mapState, mapMutations } from 'vuex'
import MappingTable from './mappingTable.vue'
import closeBtn from './closeBth.vue'
import transferToLetPeople from './components/transferToLetPeople.vue'
import ExportFile from '@/components/exportFile/'
export default {
  name: 'WaitTable',
  // inject: ['parentInfo'],
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    transferToLetPeople,
    MappingTable,
    closeBtn,
    ExportFile
  },
  watch: {
    params(val) {
      this.queryParam = { ...this.params }
      if (this.queryParam.closeStatus === '1') {
        this.exportParams = {
          ...this.exportParams,
          ...{
            templateCode:
              this.queryParam?.closeStatus === '0' ? 'buyerPlanItemExecuteExport' : 'purchasePlanClosedExecuteExport',
            // jsonTxt: {},
            exportType:
              this.queryParam?.closeStatus === '0'
                ? 'exportBuyerPlanItemExecuteList'
                : 'exportPurchasePlanClosedExecuteList',
            fileName: this.queryParam?.closeStatus === '0' ? '采购计划待执行列表' : '采购计划已关闭导出'
          }
        }
      }
    },
    implementActive(val) {
      this.columns = this.columns.map((x) => {
        return {
          ...x,
          show: this.showCloseKy.includes(x.key) ? val === 3 : false
        }
      })
    }
  },
  data() {
    return {
      showCloseKy: ['closeUserName', 'closeTime', 'applyCloseReason'],
      columns: [
        {
          title: '序号',
          key: 'name',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '是否紧急',
          key: 'isInstancy',
          dataIndex: 'isInstancy',
          customRender: (text) => {
            return text === 0 ? '否' : '是'
          }
        },
        { title: '公司名称', dataIndex: 'buyerMerchantName', key: 'buyerMerchantName' },
        { title: '采购申请编号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode' },
        { title: '计划编号', dataIndex: 'planItemCode', key: 'planItemCode' },
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '计划数量', dataIndex: 'planNum', key: 'planNum' },
        { title: '待执行计划数量', dataIndex: 'executoryNum', key: 'executoryNum', width: 200 },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit' },
        { title: '申请组织', dataIndex: 'applyDepartment', key: 'applyDepartment' },
        { title: '使用部门', dataIndex: 'useDepartment', key: 'useDepartment' },
        { title: '申报人', dataIndex: 'declarant', key: 'declarant' },
        { title: '联系人电话', dataIndex: 'contact', key: 'contact' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '历史单价(元)', dataIndex: 'formerlyPrice', key: 'formerlyPrice' },
        { title: '用途', dataIndex: 'purpose', key: 'purpose' },
        { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand' },

        { title: '计划项目编码', dataIndex: 'planProjectItemCode', key: 'planProjectItemCode', show: true },
        { title: '计划项目名称', dataIndex: 'planProjectItemName', key: 'planProjectItemName', show: true },

        {
          title: '附件',
          dataIndex: 'accessoryUrl',
          key: 'accessoryUrl',
          customRender: (text) => {
            return text ? (
              <a href={text} target="_blank" download="计划待执行附件">
                查看
              </a>
            ) : null
          }
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          width: 200,
          scopedSlots: { customRender: 'auditTime' }
        },
        { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName' },
        { title: '关闭人', dataIndex: 'closeUserName', key: 'closeUserName', show: this.implementActive === 3 },
        {
          title: '关闭时间',
          dataIndex: 'closeTime',
          key: 'closeTime',
          width: 200,
          show: this.implementActive === 3,
          scopedSlots: { customRender: 'closeTime' }
        },
        { title: '关闭原因', dataIndex: 'applyCloseReason', key: 'applyCloseReason', show: this.implementActive === 3 },
        {
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: this.params || {},
      selectedRows: [],
      selectedRowKeys: [],
      visible: false,
      visibleBuyerInfo: false,
      visibleClose: false,
      visibleCreate: false,
      applyCloseReasonId: null,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      },
      loading: true,
      exportParams: {
        templateCode: 'buyerPlanItemExecuteExport',
        jsonTxt: {},
        exportType: 'exportBuyerPlanItemExecuteList',
        fileName: '采购计划待执行列表'
      }
    }
  },
  computed: {
    ...mapState({
      implementActive: (state) => state.planManage.implementActive
    })
  },
  methods: {
    ...mapMutations(['setCountPendingExecuteObject']),
    async getList(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      if (data.time) {
        const [createStartTime, createEndTime] = data.time
        data.createStartTime = createStartTime.format('YYYY-MM-DD')
        data.createEndTime = createEndTime.format('YYYY-MM-DD')
      }
      this.exportParams.jsonTxt = { ...data }
      const result = await queryBuyerPlanProcessPage(data)
      this.setCountPendingExecuteObject({
        text: data.closeStatus === '1' ? 'executeClosed' : 'pendingExecute',
        value: result.data.total
      })
      return result
    },
    // 退回分配人
    returnToDistributor() {
      const { selectedRowKeys, selectedRows, $message, $refs } = this
      if (selectedRowKeys?.length === 0) {
        $message.warning('至少需勾选一笔数据')
        return
      }
      const bool = selectedRows.some((i) => {
        return i.executoryNum < i.planNum
      })
      if (bool) {
        $message.warning('计划待执行数量小于计划数量不允许退给分配人')
        return
      }
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确认将当前勾选的采购计划退回分配人？',
        onOk: async () => {
          const result = await buyerChange({
            buyerPlanItemId: selectedRowKeys
          })
          if (result.code === '0') {
            $message.success('退回成功')
            vm.selectedRowKeys = []
            vm.selectedRows = []
            $refs.table.refresh(true)
          }
        },
        onCancel() {}
      })
    },
    // 创建寻源
    goMerchantsPurchaseManagFoundSearch() {
      const { selectedRowKeys, $message } = this
      if (selectedRowKeys?.length === 0) {
        $message.warning('请选择寻源计划')
        return
      }
      const ids = this.selectedRows.map((item) => {
        return item.id
      })
      this.$router.push({
        name: 'MerchantsPurchaseManagFoundSearch',
        query: {
          ids: ids.join(',')
        }
      })
      // this.$store.dispatch('ACTIONS_SET_MERCHANT_PURCHASE', this.selectedRows)
    },
    checkSelectRows() {
      const { selectedRowKeys, selectedRows, $message } = this
      if (selectedRowKeys?.length === 0) {
        $message.warning('至少需勾选一笔数据')
        return false
      }
      const buyerMerchantId = Array.from(new Set(selectedRows.map((x) => x.buyerMerchantId)))
      if (buyerMerchantId.length > 1) {
        this.$message.warning('请选择统一采购商数据')
        return false
      }
      return true
    },
    // 转给他人
    transferToLetPeople() {
      if (!this.checkSelectRows()) return
      this.visibleBuyerInfo = true
    },
    updateVisible() {
      this.loading = false
      setTimeout(() => {
        this.loading = true
      }, 300)
      this.visibleBuyerInfo = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh(true)
    },
    async handleMapping() {
      this.visible = true
    },
    toMatchContract() {
      const { selectedRowKeys } = this
      if (selectedRowKeys?.length <= 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      // this.setState({ key: ['planManage', 'matchContractList'], value: selectedRows })
      this.$router.push({
        name: 'MerchantsPurchaseManagMatchContract',
        query: {
          ids: selectedRowKeys.join(',')
        }
      })
    },
    closeBtn(item) {
      this.visibleClose = true
      this.applyCloseReasonId = item.id
    },
    updateVisibleClose() {
      this.$refs.table.refresh(true)
      this.$emit('changeCount')
    },
    handleSearch(params) {
      this.queryParam = params
      this.$refs.table.refresh(true)
    },
    hanldleMappingok() {
      this.$refs.table.refresh(true)
      this.$emit('changeCount')
    },
    hanldleCreateok() {
      this.$refs.table.refresh(true)
      this.$emit('changeCount')
      this.selectedRows = []
    },
    // 创建订单
    createOrder() {
      const { selectedRows } = this
      if (!this.checkSelectRows()) return
      const ids = selectedRows.map((x) => x.id).join(',')
      this.$router.push({
        name: 'MerchantsPurchaseManagCreateOrder',
        query: {
          ids
        }
      })
    },
    goContractPurchaseAddcontract() {
      const { selectedRows } = this
      if (!this.checkSelectRows()) return
      const idList = selectedRows?.map((item) => {
        return item.id
      })
      this.$router.push({
        name: 'ContractPurchaseAddcontract',
        query: {
          ids: idList?.join(','),
          sourceType: 2
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wait-table {
  .buttons {
    margin-bottom: 20px;
    display: flex;
    .ant-btn {
      margin-left: 8px;
    }
    /deep/.exportFile {
      & > .ant-btn {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
}
</style>
