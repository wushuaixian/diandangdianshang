<template>
  <div class="mapping-table" ref="mappingTable">
    <a-modal
      :getContainer="() => $refs.mappingTable"
      destroyOnClose
      title="采购计划拟执行"
      :visible="visible"
      :width="1000"
      @ok="handleOk(2)"
      @cancel="handleCancel"
      ok-text="全部加入长协待下单"
    >
      <div v-if="dombool" style="text-align: center">
        <h2>正在智能匹配长协，请稍等.....</h2>
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 150px" spin />
        </a-spin>
      </div>
      <div v-else>
        <div class="table-page-search-wrapper-custom">
          <a-form-model
            layout="inline"
            ref="form"
            :model="queryParam"
            v-bind="{
              labelCol: { span: 8 },
              wrapperCol: { span: 16 }
            }"
          >
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="供应商" prop="providerMerchantName">
                  <supplier-search value-key="orgName" v-model="queryParam.providerMerchantName" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="物料编码" prop="materialCode">
                  <a-input v-model="queryParam.materialCode" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="物料名称" prop="materialName">
                  <a-input v-model="queryParam.materialName" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="规格型号" prop="materialModel">
                  <a-input v-model="queryParam.materialModel" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="合同编码" prop="contractCode">
                  <a-input v-model="queryParam.contractCode" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="截止到期日" prop="expireTime">
                  <a-range-picker v-model="queryParam.time" />
                  <!-- <a-date-picker v-model="queryParam.expireTime" /> -->
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <div class="button">
                  <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                </div>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="buttons">
          <a-button type="primary" @click="addchang(1)"> 加入长协待下单 </a-button>
          <a-button @click="createOrder(3)">创建订单</a-button>
        </div>
        <s-table
          v-if="groupId"
          name="mappingTable"
          ref="table"
          :columns="columns"
          :data="init"
          :scroll="{ x: 1000 }"
          rowKey="id"
          :row-selection="rowSelection"
          :pagination="{
            onChange: handlePaginationChange
          }"
        >
          <template slot="contractCode" slot-scope="record">
            <procurement @change="handleChange" :ids="record.id" :record="record" />
          </template>
          <template slot="isInstancy" slot-scope="record">
            <span v-show="record.isInstancy === 0">否</span>
            <span v-show="record.isInstancy === 1">是</span>
            <span></span>
          </template>
          <template slot="status" slot-scope="record">
            <span v-show="record.status === 1">待分配</span>
            <span v-show="record.status === 2">已分配</span>
            <span v-show="record.status === 3">已执行</span>
          </template>
          <template v-slot:auditTime="auditTime">
            {{ auditTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:expireTime="expireTime">
            {{ expireTime | moment }}
          </template>
          <!-- <template slot="customPriceWithTax">
            <span class="customTitle">含税单价</span>
          </template> -->
          <template slot="customOrderNum">
            <span class="customTitle">下单数量</span>
          </template>
          <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
            <d-slot-fileds
              :floatLength="item.floatLength"
              :type="item.type"
              :key="item.key"
              v-model="props[item.key]"
            ></d-slot-fileds>
          </template>
        </s-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { savePlanMatchingContractNew as savePlanMatchingContract, modifyPurchaseExecution } from '@/api/supplier'
import { mappingLongTermContract, ProcurementplanTobeimplemented } from '@/api/projectCarry'
import procurement from './procurement.vue'
import Enum from '@/components/_util/enum'
import { checkData } from '@/views/Suppliers/planManage/implement/_utils'
export default {
  components: { procurement },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      groupId: null,
      queryParam: {},
      dombool: true,
      list: [],
      datalist: [],
      inputKeys: [
        { key: 'orderNum', type: Enum.NUMBER, floatLength: 4 },
        { key: 'deliveryTime', type: Enum.DATE },
        { key: 'guaranteePeriod', type: Enum.NUMBER }
      ],
      columns: [
        {
          title: '公司名称',
          dataIndex: 'buyerMerchantName',
          key: 'buyerMerchantName',
          width: 200
        },
        {
          title: '是否紧急',
          key: 'isInstancy',
          scopedSlots: { customRender: 'isInstancy' },
          width: 200
        },
        {
          title: '采购员',
          key: 'buyerUserName',
          dataIndex: 'buyerUserName',
          width: 200
        },
        {
          title: '采购申请编号',
          key: 'buyerPlanCode',
          dataIndex: 'buyerPlanCode',
          width: 200
        },
        { title: '计划编号', dataIndex: 'planItemCode', key: 'planItemCode', width: 200 },
        {
          title: '物料编码',
          key: 'materialCode',
          dataIndex: 'materialCode',
          width: 200
        },
        {
          title: '物料名称',
          key: 'materialName',
          dataIndex: 'materialName',
          width: 200
        },
        {
          title: '规格型号',
          key: 'materialModel',
          dataIndex: 'materialModel',
          width: 200
        },
        {
          title: '计划数量',
          key: 'planNum',
          dataIndex: 'planNum',
          width: 200
        },
        {
          title: '待执行数量',
          key: 'executoryNum',
          dataIndex: 'executoryNum',
          width: 200
        },
        {
          title: '单位',
          key: 'mpMeasurementUnit',
          dataIndex: 'mpMeasurementUnit',
          width: 200
        },
        {
          title: '历史单价(元)',
          key: 'formerlyPrice',
          dataIndex: 'formerlyPrice',
          width: 200
        },
        {
          title: '申请组织',
          key: 'applyDepartment',
          dataIndex: 'applyDepartment',
          width: 200
        },
        {
          title: '使用部门',
          key: 'useDepartment',
          dataIndex: 'useDepartment',
          width: 200
        },
        {
          title: '备注',
          key: 'remark',
          dataIndex: 'remark',
          width: 200
        },
        {
          title: '申报人',
          key: 'declarant',
          dataIndex: 'declarant',
          width: 200
        },
        {
          title: '联系电话',
          dataIndex: 'contact',
          key: 'contact',
          width: 200
        },
        {
          title: '原使用品牌',
          key: 'formerlyBrand',
          dataIndex: 'formerlyBrand',
          width: 200
        },
        {
          title: '用途',
          key: 'purpose',
          dataIndex: 'purpose',
          width: 200
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          scopedSlots: { customRender: 'auditTime' },
          width: 200
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
        { title: '计划项目编码', dataIndex: 'planProjectItemCode', key: 'planProjectItemCode', show: true, width: 200 },
        { title: '计划项目名称', dataIndex: 'planProjectItemName', key: 'planProjectItemName', show: true, width: 200 },
        {
          title: '供应商',
          dataIndex: 'contractInfo.providerMerchantName',
          key: 'providerMerchantName',
          width: 200
        },
        {
          title: '合同编码',
          key: 'contractCode',
          width: 200,
          scopedSlots: {
            customRender: 'contractCode'
          }
        },
        {
          title: '含税单价(元)',
          dataIndex: 'contractInfo.priceWithTax',
          key: 'priceWithTax',
          width: 200
        },
        {
          title: '截止到期日',
          dataIndex: 'contractInfo.expireTime',
          key: 'expireTime',
          width: 200,
          scopedSlots: {
            customRender: 'expireTime'
          }
        },
        {
          headerTitle: '下单数量',
          slots: { title: 'customOrderNum' },
          key: 'orderNum',
          width: 200,
          scopedSlots: { customRender: 'orderNum' }
        },
        {
          title: '交货日期',
          key: 'deliveryTime',
          width: 200,
          scopedSlots: { customRender: 'deliveryTime' }
        },
        {
          title: '质保期(月)',
          key: 'guaranteePeriod',
          width: 200,
          scopedSlots: { customRender: 'guaranteePeriod' }
        }
      ]
    }
  },
  watch: {
    visible() {
      if (this.visible === true) {
        this.dombool = true
        setTimeout(() => {
          this.dombool = false
          this.mappingLongTermContract()
        }, 3000)
      }
    }
  },
  methods: {
    handleChange({ contractInfo, ids }) {
      const { localDataSource } = this.$refs.table
      this.$refs.table.localDataSource = localDataSource.map((x) => {
        const concat =
          x.id === ids
            ? {
                contractInfo,
                deliveryTime: contractInfo?.deliveryTime,
                guaranteePeriod: contractInfo?.guaranteePeriod,
                priceWithTax: contractInfo?.priceWithTax
              }
            : null
        return {
          ...x,
          ...concat
        }
      })
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handlePaginationChange() {
      this.updatePlanItem()
    },
    async mappingLongTermContract() {
      const { params } = this
      const res = await mappingLongTermContract({ ...params })
      if (res.code === '0') {
        this.groupId = res.data
      }
    },
    async init(page) {
      const { queryParam, groupId } = this
      const data = {
        ...page,
        ...queryParam,
        groupId
      }
      if (data.time) {
        const [expireStartTime, expireEndTime] = data.time
        data.expireStartTime = expireStartTime.format('YYYY-MM-DD')
        data.expireEndTime = expireEndTime.format('YYYY-MM-DD')
      }
      const {
        data: { listObj, total }
      } = await ProcurementplanTobeimplemented(data)
      return {
        data: {
          listObj: listObj?.map((x) => {
            const contractInfo = x?.longTermContracts.find((x) => x.isCheck)
            return {
              ...x,
              contractInfo,
              priceWithTax: contractInfo?.priceWithTax,
              deliveryTime: contractInfo?.deliveryTime,
              guaranteePeriod: contractInfo?.guaranteePeriod
            }
          }),
          total
        }
      }
    },
    async handleOk(operationType) {
      this.datalist = this.$refs.table.localDataSource
      if (this.$refs.table.localDataSource?.length <= 0) {
        this.$message.warning('没有匹配的数据')
        return
      }
      if (!(await this.updatePlanItem())) return
      this.savePlanMatchingContract(true, operationType)
    },
    async addchang(operationType) {
      if (this.datalist?.length <= 0) {
        this.$message.warning('请选择至少一条采购计划数据')
        return
      }
      if (!(await this.updatePlanItem())) return
      const res = await this.savePlanMatchingContract(false, operationType)
      if (res) {
        this.$refs.table.refresh()
      }
    },
    checkDatas() {
      const data = this.datalist.map((x) => {
        return {
          ...x,
          contractItemId: x?.contractInfo?.contractItemId
        }
      })
      const isContract = data.map((x) => x?.contractInfo).filter((x) => !!x)
      if (isContract.length !== data.length) {
        this.$message.warning('请选择合同')
        return
      }
      if (!checkData(data, this.datalist, this)) return null
      return data
    },
    async updatePlanItem() {
      const { localDataSource } = this.$refs.table
      const data = localDataSource.map((x) => {
        return {
          ...x,
          contractItemId: x?.contractInfo?.contractItemId,
          longTermContracts: x?.longTermContracts?.map((c) => {
            return {
              ...c,
              deliveryTime: x?.deliveryTime,
              guaranteePeriod: x?.guaranteePeriod
            }
          })
        }
      })
      const res = await modifyPurchaseExecution(data)
      if (res.code === '0') return true
      return false
    },
    async savePlanMatchingContract(bool = true, operationType) {
      const data = this.checkDatas()
      if (!data) return
      const parameterValue = operationType === 2 ? [this.groupId] : data.map((x) => x.id)
      const res = await savePlanMatchingContract({ parameterValue, operationType })
      if (res.code === '0' && operationType !== 3) {
        this.$message.success('操作成功')
        this.$emit('ok')
        this.$emit('changeCount')
        if (bool) {
          this.$emit('update:visible', false)
        }
        return true
      }
      return res
    },
    async createOrder(operationType) {
      if (this.datalist?.length <= 0) {
        this.$message.warning('请选择至少一条采购计划数据')
        return
      }
      this.updatePlanItem()
      const res = await this.savePlanMatchingContract(false, operationType)
      // const data = this.checkDatas()
      // if (!data) return
      // this.updatePlanItem()
      // const res = await savePlanMatchingContract({ ...data, operationType })
      if (res.code === '0') {
        this.$message.success('下单成功')
        this.$router.push({
          name: 'orderManagementBuyerOrderList'
        })
      }
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      // const { selectedRowKeys } = that.state
      return {
        // selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.datalist = selectedRows
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mapping-table {
  .buttons {
    margin-bottom: 20px;
  }
  .s-table {
    .customTitle {
      display: flex;
      align-items: center;
      &::before {
        content: '*';
        color: red;
        margin-right: 5px;
      }
    }
  }
}
.anticon-spin {
  width: 300px;
  height: 300px;
}
</style>
