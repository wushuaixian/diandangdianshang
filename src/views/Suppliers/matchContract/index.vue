<template>
  <div class="match-contract">
    <a-card>
      <header-title>
        <span>手动匹配合同</span>
      </header-title>
      <div class="buttons">
        <a-button type="primary" @click="handleAdd">加入合同待下单</a-button>
        <a-button @click="createOrderPlanToBeExecuted">创建订单</a-button>
      </div>
      <s-table
        name="matchContractTabless"
        ref="table"
        :rowSelection="rowSelection"
        rowKey="id"
        :columns="columns"
        :list="matchContractList"
        :scroll="{ x: 3000 }"
        :customPage="true"
      >
        <template v-slot:contractNum="props">
          <a v-if="!$$(props, 'contractInfo')" @click="handleSelectContract(props)">请选择</a>
          <a v-else type="link" @click="handleSelectContract(props)">
            {{ $$(props, 'contractInfo', 'code') }}
          </a>
        </template>
        <template v-slot:isContract="props">
          <span v-if="props.contractInfo">
            {{
              $$(
                instancyList.find((x) => x.value === props.contractInfo.frameBuyer),
                'label'
              )
            }}
          </span>
        </template>
        <template v-slot:expireTime="props">
          {{ $$(props, 'contractInfo', 'expireTime') | moment }}
        </template>
        <template v-slot:action="props">
          <a @click="handleRemove(props)">移除</a>
        </template>
        <template slot="customPriceWithTax">
          <span class="customTitle">含税单价</span>
        </template>
        <template slot="customOrderNum">
          <span class="customTitle">下单数量</span>
        </template>
        <template slot="customDeliveryTime">
          <span class="customTitle">交货日期</span>
        </template>
        <template slot="customGuaranteePeriod">
          <span>质保期(月)</span>
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
    </a-card>

    <ContractTable :id="id" :buyerMerchantIds="buyerMerchantIds" :visible.sync="visible" @ok="hanldeOk" />
  </div>
</template>

<script>
import ContractTable from './components/seledtContract/contractTable'
import { savePlanMatchingContract, getItemByIds, createOrderPlanToBeExecuted } from '@/api/projectCarry'
import { instancyList } from '@/config/constant'
import Enum from '@/components/_util/enum'
import _ from 'loadsh'
import { checkData } from './_utils'
export default {
  components: { ContractTable },
  provide() {
    return {
      info: null
    }
  },
  data() {
    return {
      rules: {
        priceWithTax: [{ required: true, message: '请输入含税单价', trigger: 'change' }]
      },
      instancyList,
      inputKeys: [
        { key: 'priceWithTax', type: Enum.NUMBER, floatLength: 4 },
        { key: 'orderNum', type: Enum.NUMBER, floatLength: 4 },
        { key: 'deliveryTime', type: Enum.DATE },
        { key: 'guaranteePeriod', type: Enum.NUMBER }
      ],
      ids: this.$route.query.ids?.split(','),
      visible: false,
      confirmLoading: false,
      matchContractList: [],
      columns: [
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode', width: 200 },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 200 },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', width: 200 },
        { title: '计划数量', dataIndex: 'planNum', key: 'planNum', width: 200 },
        { title: '待执行数量', dataIndex: 'executoryNum', key: 'executoryNum', width: 200 },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit', width: 200 },
        { title: '历史单价(元)', dataIndex: 'formerlyPrice', key: 'formerlyPrice', width: 200 },

        { title: '申请组织', dataIndex: 'applyDepartment', key: 'applyDepartment', width: 200 },
        { title: '备注', dataIndex: 'remark', key: 'remark', width: 200 },
        { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand', width: 200 },

        { title: '合同编号', key: 'contractNum', scopedSlots: { customRender: 'contractNum' }, width: 200 },
        { title: '合同类型', key: 'contractType', dataIndex: 'contractInfo.contractTypeName', width: 200 },
        { title: '是否框架合同', key: 'isContract', scopedSlots: { customRender: 'isContract' }, width: 200 },
        { title: '截止日期', key: 'expireTime', scopedSlots: { customRender: 'expireTime' }, width: 200 },
        {
          headerTitle: '含税单价(元)',
          slots: { title: 'customPriceWithTax' },
          // dataIndex: 'priceWithTax',
          key: 'priceWithTax',
          width: 200,
          scopedSlots: { customRender: 'priceWithTax' }
        },
        {
          headerTitle: '下单数量',
          slots: { title: 'customOrderNum' },
          key: 'orderNum',
          width: 200,
          scopedSlots: { customRender: 'orderNum' }
        },
        {
          headerTitle: '交货日期',
          slots: { title: 'customDeliveryTime' },
          key: 'deliveryTime',
          width: 200,
          scopedSlots: { customRender: 'deliveryTime' }
        },
        {
          headerTitle: '质保期',
          slots: { title: 'customGuaranteePeriod' },
          key: 'guaranteePeriod',
          width: 200,
          scopedSlots: { customRender: 'guaranteePeriod' }
        },
        { key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
      ],
      id: '',
      selectRows: [],
      buyerMerchantIds: [],
      rowSelection: {
        onChange: (selectRowsKeys, selectRows) => {
          this.selectRows = selectRows
        }
      }
    }
  },
  created() {
    this.handleAdd = _.debounce(this.handleAdd, 500)
    this.getList()
  },
  methods: {
    async getList() {
      const { ids } = this
      const res = await getItemByIds({ ids })
      if (res.code === '0') {
        this.matchContractList = res.data?.map((x) => {
          return { ...x, orderNum: x.executoryNum }
        })
        // const newArr = []
        // this.buyerMerchantIds = this.matchContractList.reduce((pro, cur) => {
        //   if (newArr && newArr.includes(cur.buyerMerchantId)) return pro
        //   newArr.push(cur.buyerMerchantId)
        //   pro.push(cur.buyerMerchantId)
        //   return pro
        // }, [])
      }
    },
    handleSelectContract(props) {
      const { id, buyerMerchantId, executoryNum } = props
      this._provided.info = props
      this.id = id
      this.executoryNum = executoryNum
      this.buyerMerchantIds = [buyerMerchantId]
      this.visible = true
    },
    hanldeOk({ contractInfo, matereialInfo }) {
      const { executoryNum } = this
      if (contractInfo?.contractType === 2 && executoryNum > matereialInfo?.contractMaterialNum) {
        this.$confirm({
          title: '提示',
          content: '计划待执行数量大于零采合同数量可匹配的数量,确认匹配',
          onOk: async () => {
            this.setContractList(contractInfo, matereialInfo)
          },
          onCancel() {}
        })
      } else {
        this.setContractList(contractInfo, matereialInfo)
        // vm.matchContractList = matchContractList.map((x) => {
        //   return {
        //     ...x,
        //     contractInfo: x.id === id ? contractInfo : x?.contractInfo,
        //     matereialInfo: x.id === id ? matereialInfo : x?.matereialInfo,
        //     priceWithTax: x.id === id ? matereialInfo?.priceWithTax : x?.priceWithTax,
        //     executoryNum: x.id === id ? matereialInfo?.executoryNum : x?.executoryNum,
        //     deliveryTime: x.id === id ? matereialInfo?.deliveryTime : x?.deliveryTime,
        //     ext1Info: x.id === id ? matereialInfo?.ext1Info : x?.ext1Info,
        //     taxRate: x.id === id ? matereialInfo?.taxRate : x?.taxRate
        //   }
        // })
      }
    },
    setContractList(contractInfo, matereialInfo) {
      const { id } = this
      this.matchContractList = this.matchContractList.map((x) => {
        const { priceWithTax, deliveryTime, ext1Info, taxRate } = matereialInfo
        const data = {
          priceWithTax,
          deliveryTime,
          ext1Info,
          taxRate
        }
        return {
          ...x,
          contractInfo: x.id === id ? contractInfo : x?.contractInfo,
          matereialInfo: x.id === id ? matereialInfo : x?.matereialInfo,
          ...(x.id === id ? { ...data } : null)
        }
      })
    },
    checkDatas() {
      const { selectRows } = this
      if (selectRows.length <= 0) {
        this.$message.warning('请至少选择一条数据')
        return null
      }
      this.confirmLoading = true
      const data = selectRows.map((x) => {
        const item = this.$refs.table.localDataSource.find((c) => c.id === x.id)
        return {
          ...item,
          contractItemId: item?.matereialInfo?.id
        }
      })
      if (!checkData(data, selectRows, this)) return null
      return data
    },
    async createOrderPlanToBeExecuted() {
      const data = this.checkDatas()
      if (!data) return
      const res = await createOrderPlanToBeExecuted(data).finally(() => (this.confirmLoading = false))
      if (res.code === '0') {
        this.$message.success('下单成功')
        this.$router.push({
          name: 'orderManagementBuyerOrderList'
        })
      }
    },
    async handleAdd() {
      const data = this.checkDatas()
      if (!data) return
      // const isMaterialCode =  data
      const res = await savePlanMatchingContract(data).finally(() => (this.confirmLoading = false))
      if (res.code === '0') {
        this.$router.push({
          name: 'MerchantsPurchaseManagCarry'
        })
      }
    },
    handleRemove({ id }) {
      const index = this.matchContractList.findIndex((x) => x.id === id)
      const idsIndex = this.ids.findIndex((x) => Number(x) === id)
      this.matchContractList.splice(index, 1)
      this.ids.splice(idsIndex, 1)
      this.$router.replace({
        name: 'MerchantsPurchaseManagMatchContract',
        query: {
          ids: this.ids.join(',')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.match-contract {
  .buttons {
    margin-top: 16px;
    margin-bottom: 20px;
  }
  .ant-table {
    .ant-select {
      width: 100%;
    }
  }
  .ant-card + .ant-card {
    margin-top: 20px;
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
</style>
