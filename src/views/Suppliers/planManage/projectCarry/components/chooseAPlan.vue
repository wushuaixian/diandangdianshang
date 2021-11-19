<!--
 * @Author: your name
 * @Date: 2021-06-23 22:21:14
 * @LastEditTime: 2021-07-01 20:39:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/projectCarry/components/chooseAPlan.vue
-->
<template>
  <div>
    <a-modal :visible="visible" width="1000px" @ok="handleOk" @cancel="closePupup">
      <SearchForm @search="goSearch"></SearchForm>
      <s-table
        name="chooseAPlan"
        ref="table"
        rowKey="id"
        key="wait-table"
        :row-selection="rowSelection"
        :data="getList"
        :columns="columns"
        :scroll="{ x: 3000, y: 400 }"
        rol
      >
        <template v-slot:auditTime="props">
          {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <!-- <a slot="action" href="javascript:;">删除</a> -->
      </s-table>
    </a-modal>
  </div>
</template>
<script>
import SearchForm from '../../implement/compoents/waitPage/search/form'
import { queryBuyerPlanProcessPage } from '@/api/projectCarry'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    foundSearchDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    ids: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  components: {
    SearchForm
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      queryParam: {},
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.ids.includes(record.id) // Column configuration not to be checked
          }
        })
      },
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
          title: '紧急',

          dataIndex: 'address',
          customRender: (text) => {
            return text === '0' ? '否' : '是'
          }
        },
        { title: '公司名称', dataIndex: 'buyerMerchantName', key: 'buyerMerchantName' },
        { title: '采购计划编号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode' },
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
        { title: '历史价格', dataIndex: 'formerlyPrice', key: 'formerlyPrice' },
        { title: '用途', dataIndex: 'purpose', key: 'purpose' },
        { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand' },

        { title: '计划项目编码', dataIndex: 'planProjectCode', key: 'planProjectCode' },
        { title: '计划项目名称', dataIndex: 'planProjectName', key: 'planProjectName' },

        {
          title: '附件',
          dataIndex: 'accessoryUrl',
          key: 'accessoryUrl',
          customRender: (text) => {
            return (
              <a href={text} target="_blank">
                查看
              </a>
            )
          }
        },
        { title: '审核时间', dataIndex: 'auditTime', scopedSlots: { customRender: 'auditTime' } },
        { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName' }
        // {
        //   key: 'action',
        //   fixed: 'right',

        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  methods: {
    goSearch(data) {
      this.queryParam = data
      this.$refs.table.refresh(true)
    },
    async getList(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam,
        closeStatus: this.$store.state.planManage.implementActive,
        status: '2'
      }
      if (data.time) {
        const [createStartTime, createEndTime] = data.time
        data.createStartTime = createStartTime.format('YYYY-MM-DD')
        data.createEndTime = createEndTime.format('YYYY-MM-DD')
      }
      return queryBuyerPlanProcessPage(data)
    },
    closePupup() {
      this.$emit('updateVisible')
    },
    handleOk() {
      this.$emit('updateVisible')
      const { ids } = this
      const newIds = [...this.selectedRowKeys, ids.split(',')]
      this.$emit('idsChange', newIds.join(','))
      // this.$store.dispatch('ACTIONS_SET_MERCHANT_PURCHASE', this.selectedRows)
    }
  }
}
</script>
<style lang='less' scoped>
/deep/ .ant-modal {
  max-height: 700px;
}
</style>
