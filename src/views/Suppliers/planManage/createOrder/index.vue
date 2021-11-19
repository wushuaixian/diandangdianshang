<template>
  <a-card class="create-order">
    <div class="SearchName">
      <span>供应方：</span>
      <d-select :label-in-value="false" v-model="id" show-search :filterOption="handleFetch" @search="searchs">
        <a-select-option v-for="item of merchantList" :key="item.merchantId" :value="item.merchantId">{{
          item.merchantName
        }}</a-select-option>
      </d-select>
      <!-- <a-button type="primary" style="margin-left: 10px" @click="searchs"> 查询 </a-button> -->
    </div>
    <s-table
      name="PlanCreateOrderTable"
      ref="table"
      :columns="columns"
      :list="list"
      :scroll="{ x: 3000 }"
      rowKey="id"
      :row-selection="rowSelection"
      :customPage="true"
    >
      <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
        <d-slot-fileds
          :type="item.type"
          :floatLength="item.floatLength"
          :key="item.key"
          :max="item.max"
          :min="item.min"
          v-model="props[item.key]"
        ></d-slot-fileds>
      </template>
      <template v-slot:action="props">
        <a @click="handleDelete(props)">移除</a>
      </template>

      <template slot="customTaxRate">
        <span class="customTitle">税率(%)</span>
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
    </s-table>
    <div class="buttons">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk">创建订单</a-button>
    </div>
  </a-card>
</template>

<script>
import { getItemByIds, createOrder, selectStoreOrgInfoByEnterpriseName } from '@/api/projectCarry'
import { getComList } from '@/api/contract'
import Enum from '@/components/_util/enum'
import { checkData } from './_utils'
export default {
  data() {
    return {
      merchantList: [],
      ids: this.$route.query.ids?.split(','),
      id: '',
      list: [],
      checkeds: [],
      datalist: [],
      inputKeys: [
        { key: 'taxRate', type: Enum.NUMBER, max: 100, min: 0 },
        { key: 'priceWithTax', type: Enum.NUMBER, floatLength: 2 },
        { key: 'orderNum', type: Enum.NUMBER, floatLength: 4 },
        { key: 'deliveryTime', type: Enum.DATE },
        { key: 'guaranteePeriod', type: Enum.NUMBER }
      ],
      columns: [
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode', width: 200 },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 200 },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', width: 200 },
        { title: '计划数量', dataIndex: 'planNum', key: 'planNum', width: 200 },
        { title: '待执行计划数量', dataIndex: 'executoryNum', key: 'executoryNum', width: 200 },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit', width: 200 },
        { title: '申请组织', dataIndex: 'applyDepartment', key: 'applyDepartment', width: 200 },
        { title: '备注', dataIndex: 'remark', key: 'remark', width: 200 },
        { title: '原使用品牌', dataIndex: 'formerlyBrand', key: 'formerlyBrand', width: 200 },
        { title: '公司名称', dataIndex: 'buyerMerchantName', key: 'buyerMerchantName', width: 200 },

        {
          headerTitle: '税率(%)',
          slots: { title: 'customTaxRate' },
          key: 'taxRate',
          scopedSlots: { customRender: 'taxRate' },
          width: 200
        },
        {
          headerTitle: '含税单价(元)',
          slots: { title: 'customPriceWithTax' },
          key: 'priceWithTax',
          scopedSlots: { customRender: 'priceWithTax' },
          width: 200
        },
        {
          headerTitle: '下单数量',
          slots: { title: 'customOrderNum' },
          key: 'orderNum',
          scopedSlots: { customRender: 'orderNum' },
          width: 200
        },
        {
          headerTitle: '交货日期',
          slots: { title: 'customDeliveryTime' },
          key: 'deliveryTime',
          scopedSlots: { customRender: 'deliveryTime' },
          width: 200
        },
        {
          title: '质保期(月)',
          key: 'guaranteePeriod',
          scopedSlots: { customRender: 'guaranteePeriod' },
          width: 200
        },
        {
          key: 'action',
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' }
        }
      ],
      storeInfo: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    //  this.getComList()
  },
  methods: {
    async getComList() {
      const res = await getComList(1)
      if (res.code === '0') {
        this.merchantList = res?.data?.buyerMerchantList?.map((x) => {
          return {
            label: x?.orgName,
            value: x?.id
          }
        })
      }
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },

    async getList() {
      const { ids } = this
      const res = await getItemByIds({ ids })
      if (res.code === '0') {
        this.list = res.data.map((item) => {
          item.orderNum = item.executoryNum
          return item
        })
      }
    },
    async handleOk() {
      const { checkeds: buyerPlanItemPOList } = this
      if (buyerPlanItemPOList?.length <= 0) {
        this.$message.error('请选择一条数据')
        return
      }
      const { id, merchantList } = this

      if (!id) {
        this.$message.error('未查询到相关店铺信息')
        return
      }
      const storeInfo = merchantList.find((x) => x.merchantId === id)
      const { merchantName, merchantId, storeId, storeName } = storeInfo
      const data = {
        merchantName,
        merchantId,
        storeId,
        storeName,
        buyerPlanItemPOList
      }
      if (!checkData(buyerPlanItemPOList, this)) return
      const res = await createOrder(data)
      if (res.code === '0') {
        this.$message.success('下单成功')
        this.$router.push({
          name: 'orderManagementBuyerOrderList'
        })
      }
    },
    // 查询
    async searchs(enterpriseName) {
      if (!enterpriseName) return
      const res = await selectStoreOrgInfoByEnterpriseName({ enterpriseName })
      if (res.code === '0') {
        this.merchantList = res?.data
      }
    },

    handleCancel() {
      this.$router.go(-1)
    },
    handleDelete({ id }) {
      const index = this.list.findIndex((x) => x.id === id)
      const idsIndex = this.ids.findIndex((x) => Number(x) === id)
      this.list.splice(index, 1)
      this.ids.splice(idsIndex, 1)
      this.$router.replace({
        name: 'MerchantsPurchaseManagCreateOrder',
        query: {
          ids: this.ids.join(',')
        }
      })
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
          that.checkeds = selectedRows
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.create-order {
  .mapping-table {
    .buttons {
      margin-bottom: 20px;
    }
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
  .anticon-spin {
    width: 300px;
    height: 300px;
  }
  .SearchName {
    text-align: center;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
      margin-left: 60px;
    }
    /deep/.d-select {
      width: 300px;
    }
  }
  .buttons {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
