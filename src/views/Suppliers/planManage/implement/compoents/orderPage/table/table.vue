<template>
  <div class="source-table">
    <div class="buttons">
      <ExportFile :params="exportParams" />
      <!-- <a-button type="primary">移至待执行</a-button> -->
    </div>
    <s-table
      rowKey="id"
      name="orderPageTable"
      ref="table"
      :rowSelection="rowSelection"
      :data="getList"
      :columns="columns"
      :scroll="{ x: 3400 }"
    >
      <template v-slot:auditTime="props">
        {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </s-table>
  </div>
</template>

<script>
import { planExecuteListPage } from '@/api/projectCarry'
import { mapMutations } from 'vuex'
import ExportFile from '@/components/exportFile/'
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
          dataIndex: 'isInstancy'
        },
        { title: '公司名称', dataIndex: 'buyerMerchantName', key: 'buyerMerchantName', width: 240 },
        { title: '采购申请编号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode', width: 200 },
        { title: '计划编号', dataIndex: 'planItemCode', key: 'planItemCode' },
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '计划数量', dataIndex: 'planNum', key: 'planNum' },
        { title: '下单数量', dataIndex: 'productItemNum', key: 'productItemNum' },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit' },
        { title: '申请组织', dataIndex: 'applyDepartment', key: 'applyDepartment' },
        { title: '使用部门', dataIndex: 'useDepartment', key: 'useDepartment' },
        { title: '申报人', dataIndex: 'declarant', key: 'declarant' },
        { title: '联系人电话', dataIndex: 'contact', key: 'contact' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '历史单价(元)', dataIndex: 'formerlyPrice', key: 'formerlyPrice' },
        { title: '用途', dataIndex: 'purpose', key: 'purpose' },
        { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand' },
        { title: '计划项目编码', dataIndex: 'planProjectItemCode', key: 'planProjectItemCode', show: true, width: 200 },
        { title: '计划项目名称', dataIndex: 'planProjectItemName', key: 'planProjectItemName', show: true, width: 200 },
        {
          title: '附件',
          dataIndex: 'accessoryUrl',
          key: 'accessoryUrl',
          customRender: (text) => {
            if (text) {
              return (
                <a href={text} target="_blank">
                  查看
                </a>
              )
            } else {
              return <div></div>
            }
          }
        },
        { title: '采购员', dataIndex: 'buyerUserName', key: 'buyerUserName' },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          width: 200,
          key: 'auditTime',
          scopedSlots: { customRender: 'auditTime' }
        }
      ],
      queryParam: this.params || {},
      exportParams: {
        templateCode: 'planExecuteListExport',
        jsonTxt: {},
        exportType: 'exportPlanExecuteList',
        fileName: '计划执行已下单'
      }
    }
  },
  methods: {
    ...mapMutations(['setCountPendingExecuteObject']),
    async getList(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      this.exportParams.jsonTxt = { ...data }
      const result = await planExecuteListPage(data)
      this.setCountPendingExecuteObject({
        text: 'orderNumCount',
        value: result.data.total
      })
      return result
    },
    handleSearch(params) {
      this.queryParam = params
      this.$refs.table.refresh(true)
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.source-table {
  .buttons {
    margin-bottom: 20px;
    /deep/.exportFile {
      & > .ant-btn {
        margin-right: 0;
        margin-left: 8px;
      }
    }
    .ant-btn {
      margin-left: 8px;
    }
    .ant-btn-custom {
      color: #ff8929;
      background-color: #fff;
      border-color: #ff8929;
    }
  }
}
</style>
