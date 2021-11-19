<template>
  <div class="match-table">
    <div class="buttons">
      <a-button type="primary" @click="topending">移至待执行</a-button>
      <a-button type="custom" @click="createOrder">创建订单</a-button>
      <ExportFile :params="exportParams" />
    </div>
    <s-table
      name="matchTable"
      rowKey="id"
      ref="table"
      key="match-table"
      :rowSelection="rowSelection"
      :data="getList"
      :columns="columns"
      :scroll="{ x: 3600 }"
    >
      <template v-slot:auditTime="props">
        {{ props | moment }}
      </template>
      <template v-slot:planAuditTime="planAuditTime">
        {{ planAuditTime | moment }}
      </template>
      <template v-slot:deliveryTime="deliveryTime">
        <div>
          {{ deliveryTime | moment }}
        </div>
      </template>
    </s-table>
  </div>
</template>

<script>
import { queryplanMatchingContractPage, pendingOrder } from '@/api/projectCarry'
import { moveToPending } from '@/api/supplier'
import { mapMutations } from 'vuex'
import ExportFile from '@/components/exportFile/'
// import { buyerChange } from '@/api/buyerPlanItem'
export default {
  components: { ExportFile },
  name: 'MatchTable',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
        { title: '公司名称', dataIndex: 'buyEnterpriseName', key: 'buyEnterpriseName' },
        { title: '采购申请编号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode' },
        { title: '计划编号', dataIndex: 'planItemCode', key: 'planItemCode' },
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '待下单数量', dataIndex: 'executoryNum', key: 'executoryNum' },
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
        { title: '合同编号', dataIndex: 'contractCode', key: 'contractCode' },
        { title: '含税单价(元)', dataIndex: 'priceWithTax', key: 'priceWithTax' },
        { title: '质保期（月）', dataIndex: 'guaranteePeriod', key: 'guaranteePeriod', width: 150 },
        {
          title: '交货日期',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          scopedSlots: { customRender: 'deliveryTime' }
        },
        {
          title: '附件',
          dataIndex: 'accessoryUrl',
          key: 'accessoryUrl',
          customRender: (text) => {
            return text ? (
              <a href={text} target="_blank">
                查看
              </a>
            ) : null
          }
        },
        {
          title: '审核时间',
          dataIndex: 'planAuditTime',
          key: 'planAuditTime',
          width: 200,
          scopedSlots: { customRender: 'planAuditTime' }
        },
        { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName' },
        {
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: this.params || {},
      ids: [],
      templateCode: ['', 'longTermPendOrderListExport', 'detailPendOrderListExport'],
      exportType: ['', 'exportLongTermPendOrderList', 'exportDetailPendOrderList'],
      exportParams: {
        templateCode: '',
        jsonTxt: {},
        exportType: '',
        fileName: '采购计划待执行列表'
      },
      selectRows: []
    }
  },
  mounted() {
    const {
      params: { contractType }
    } = this
    this.exportParams.templateCode = this.templateCode[contractType]
    this.exportParams.exportType = this.exportType[contractType]
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
      const result = await queryplanMatchingContractPage(data)
      this.setCountPendingExecuteObject({
        text: data.contractType === 1 ? 'longTermOrder' : 'detailOrder',
        value: result.data.total
      })
      return result
    },
    handleSearch(params) {
      this.queryParam = params
      this.$refs.table.refresh(true)
    },
    topending() {
      // 移至待分配
      if (this.ids?.length <= 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定要移至待执行?',
        onOk: async () => {
          const res = await moveToPending(this.ids)
          if (res.code === '0') {
            this.$message.success('操作成功')
            this.$refs.table.refresh(true)
            this.ids = []
            this.selectRows = []
            this.$emit('changeCount')
          }
        }
      })
    },
    // 创建订单
    async createOrder() {
      const { selectRows } = this
      if (selectRows?.length <= 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      const data = [...selectRows]
      const res = await pendingOrder(data)
      if (res.code === '0') {
        this.$message.success('下单成功')
        this.$router.push({
          name: 'orderManagementBuyerOrderList'
        })
      }
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectRows) => {
          that.selectRows = selectRows
          that.ids = selectRows.map((x) => {
            return {
              id: x.id,
              contractType: x.contractType
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.match-table {
  .buttons {
    margin-bottom: 20px;
    .ant-btn {
      margin-left: 8px;
    }
    /deep/.exportFile {
      & > .ant-btn {
        margin-right: 0;
        margin-left: 8px;
      }
    }
    .ant-btn-custom {
      color: #ff8929;
      background-color: #fff;
      border-color: #ff8929;
    }
  }
}
</style>
