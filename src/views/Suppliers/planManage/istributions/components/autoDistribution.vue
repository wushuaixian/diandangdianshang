<template>
  <div class="auto-distribution" ref="content">
    <a-modal
      destroyOnClose
      width="1000px"
      title="采购计划拟分配"
      @cancel="handleCancel"
      :visible="visible"
      :getContainer="() => this.$refs.content"
      okText="全部确认"
      :confirmLoading="loading"
      @ok="handleAllConfirm"
    >
      <div v-if="dombool" style="text-align: center">
        <h2>正在分配，请稍等.....</h2>
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 150px" spin />
        </a-spin>
        <!-- <a-spin :indicator="indicator" /> -->
      </div>
      <div v-else>
        <div class="buttons">
          <a-button type="primary" @click="handleConfirm">确认分配所选计划</a-button>
          <a-button @click="handleShowBuyer">调整采购员</a-button>
        </div>
        <s-table
          name="AutoDistributionTables"
          ref="table"
          rowKey="id"
          :pageSizeOptions="['100', '200', '300', '400', '500']"
          :pageSize="100"
          :columns="columns"
          :list="localList"
          :customPage="true"
          :scroll="{ x: 3200, y: 300 }"
          :rowSelection="{ selectedRowKeys: this.selectRowkeys, onChange: this.handlePagationChange }"
        >
          <template v-slot:auditTime="auditTime">
            {{ auditTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </s-table>
        <BuyerTable
          @ok="handleBuyerChange"
          :visible.sync="showBuyer"
          :merchantId="merchantId"
          :parentKeys="selectRowkeys"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { instancyList } from '@/config/constant'
import BuyerTable from './buyerTable.vue'
import { confirmAllocation } from '@/api/buyerPlanItem'
const columns = [
  {
    title: '序号',
    key: 'name',
    fixed: 'left',
    width: 60,
    customRender: (text, record, index) => {
      return index + 1
    }
  },
  { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName' },
  {
    title: '紧急',
    key: 'address',
    dataIndex: 'address',
    customRender: (text) => {
      return text === '0' ? '否' : '是'
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
  { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', scopedSlots: { customRender: 'auditTime' } }
]
export default {
  components: { BuyerTable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    merchantId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      columns,
      instancyList,
      localList: this.list || [],
      selectRowkeys: [],
      selectRows: [],
      showBuyer: false,
      visibleClose: false,
      dombool: true,
      loading: false
    }
  },
  watch: {
    visible() {
      if (this.visible === true) {
        setTimeout(() => {
          this.dombool = false
        }, 2000)
      }
    },
    list(val) {
      this.localList = val
    }
  },
  methods: {
    handleCancel() {
      this.dombool = true
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handlePagationChange(selectRowkeys, selectRows) {
      this.selectRowkeys = selectRowkeys
      this.selectRows = selectRows
    },
    handleShowBuyer() {
      if (this.selectRowkeys.length <= 0) {
        this.$message.warning('请选择至少一条计划')
        return
      }
      this.dombool = false
      this.showBuyer = true
    },
    handleBuyerChange({ parentKeys, selectRows: [buyer] }) {
      this.$refs.table.localDataSource = this.$refs.table.localDataSource.map((x) => {
        return {
          ...x,
          buyerUserName: parentKeys?.includes(x.id) ? buyer?.identityCardName : x?.buyerUserName,
          buyerUserId: parentKeys?.includes(x.id) ? buyer?.id : x?.buyerUserId
        }
      })
    },
    handleConfirm() {
      const { selectRows } = this
      if (selectRows?.length <= 0) {
        this.$message.warning('暂无计划可分配')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确认分配所选计划?',
        onOk: async () => {
          const { selectRows } = this
          this.loading = true
          const data = selectRows.map((x) => {
            return {
              id: x?.id,
              buyerUserId: x?.buyerUserId
            }
          })
          const res = await confirmAllocation(data).finally(() => (this.loading = false))
          if (res.code === '0') {
            this.$message.success('分配成功')
            this.localList.deleteItemAll(this.selectRowkeys)
            this.selectRowkeys = []
            this.selectRows = []
          }
        },
        onCancel() {}
      })
    },
    async handleAllConfirm() {
      if (this.list.length <= 0) {
        this.$message.warning('暂无计划可分配')
        return
      }
      this.loading = true
      const data = this.$refs.table.localDataSource?.map((x) => {
        return {
          id: x?.id,
          buyerUserId: x?.buyerUserId
        }
      })
      const res = await confirmAllocation(data).finally(() => (this.loading = false))
      if (res.code === '0') {
        this.$message.success('分配成功')
        this.dombool = false
        this.$emit('ok')
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.auto-distribution {
  .buttons {
    margin-bottom: 20px;
  }
  .ant-table {
    height: 400px;
  }
}
.text {
  text-align: center;
}
</style>
