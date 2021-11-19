<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          layout="inline"
          ref="form"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <span>{{ querydetails.buyerMerchantName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="联合采购公司">
                <span>{{ querydetails.unionBuyerMerchantName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="供应商">
                <span>{{ querydetails.providerMerchantName }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="采购项目编码">
                <span>{{ querydetails.buyerProjectCode }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="采购项目名称">
                <span>{{ querydetails.buyerProjectName }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="采购员">
                <span>{{ querydetails.buyerName }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="采购类型">
                <span v-show="querydetails.contractType === 1">长协合同</span>
                <span v-show="querydetails.contractType === 2">零采合同</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="是否框架采购">
                <span v-show="querydetails.frameBuyer === 0">否</span>
                <span v-show="querydetails.frameBuyer === 1">是</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="长协有效期限（月）">
                <span>{{ querydetails.indate }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="招标方式">
                <span>{{ querydetails.biddingTypeStr }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="寻源方式">
                <span>{{ querydetails.searchMannerStr }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="付款方式">
                <span v-show="querydetails.paymentMethod === 1">账期</span>
                <span v-show="querydetails.paymentMethod === 2">分阶段付款</span>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" v-show="querydetails.paymentMethod === 1">
              <a-form-model-item label="账期">
                <span>{{ querydetails.paymentDays }}(天)</span>
              </a-form-model-item> </a-col
            ><a-col :md="8" v-show="querydetails.paymentMethod === 2">
              <a-form-model-item label="分阶段付款">
                <span>{{ querydetails.progressPayment }}</span>
              </a-form-model-item> </a-col
            ><a-col :md="8">
              <a-form-model-item label="支付方式">
                <span v-show="querydetails.paymentType === 1">电汇</span>
                <span v-show="querydetails.paymentType === 2">承兑</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <s-table
        name="DetailListTables"
        rowKey="id"
        ref="table"
        :columns="columns"
        :customPage="true"
        :list="querydetails.contractPurchaseSignItemVOS"
        :scroll="{ x: 2000 }"
      >
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | moment }}
          </div>
          <div v-else></div>
        </template>
        <template v-slot:deliveryTime="props">
          <div v-if="props">
            {{ props | moment }}
          </div>
          <div v-else></div>
        </template>
      </s-table>
    </a-card>
    <div class="closebutton">
      <a-button type="danger" class="close" @click="close"> 返回 </a-button>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/appealManage'
import { queryContractPurchaseById } from '@/api/salescontract'

export default {
  data() {
    return {
      colorList: ['orange', 'blue', 'red'],
      columns: [
        {
          title: '物料编码',
          dataIndex: 'materialCode',
          key: 'materialCode'
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          key: 'materialName'
        },
        {
          title: '规格型号',
          dataIndex: 'materialModel',
          key: 'materialModel'
        },
        {
          title: '单位',
          dataIndex: 'mpMeasurementUnit',
          key: 'mpMeasurementUnit'
        },
        {
          title: '中标数量',
          dataIndex: 'biddingNum',
          key: 'biddingNum'
        },
        {
          title: '含税单价(元)',
          dataIndex: 'priceWithTax',
          key: 'priceWithTax'
        },
        {
          title: '税率%',
          dataIndex: 'taxRate',
          key: 'taxRate'
        },
        {
          title: '未税单价(元)',
          dataIndex: 'unitPiceWithout',
          key: 'unitPiceWithout',
          customRender: (text, record, index) => {
            return this.sum_price(record.priceWithTax, record.taxRate)
          }
        },
        {
          title: '含税金额(元)',
          key: 'taxAmount',
          customRender: (text, record, index) => {
            return this.sumTotal(record.biddingNum, record.priceWithTax)
          }
        },
        {
          title: '未税金额(元)',
          dataIndex: 'taxAmountWithout',
          key: 'taxAmountWithout',
          customRender: (text, record, index) => {
            return this.sum_price(record.priceWithTax, record.taxRate) * record.biddingNum
          }
        },
        // {
        //   title: '交货期',
        //   key: 'deliveryTime',
        //   scopedSlots: { customRender: 'deliveryTime' }
        // },
        {
          title: '交货天数',
          dataIndex: 'deliveryDays',
          key: 'deliveryDays'
        },
        {
          title: '质保期 (月)',
          dataIndex: 'guaranteePeriod',
          key: 'guaranteePeriod'
        },
        // {
        //   title: '交货地点',
        //   dataIndex: 'deliveryPoints',
        //   key: 'deliveryPoints'
        // },
        {
          title: '计划编号',
          dataIndex: 'planItemCode',
          width: 140,
          key: 'planItemCode'
        }
        // {
        //   title: '采购计划明细id',
        //   dataIndex: 'buyerPlanItemId',
        //   width: 140,
        //   key: 'buyerPlanItemId'
        // }
        // {
        //   title: '推送时间',
        //   dataIndex: 'createTime',
        //   key: 'createTime',
        //   scopedSlots: { customRender: 'createTime' }
        // },
        // {
        //   title: '附件',
        //   dataIndex: 'identitySource1',
        //   key: 'identitySource1'
        // }
      ],
      queryParam: {
        complaintStatus: '',
        businessName: '',
        time: null
      },
      advanced: false,
      list: [],
      querydetails: []
    }
  },
  methods: {
    async queryContractPurchaseById() {
      try {
        var r = window.location.search.split('=')[1]
        console.log(r)
        const { data } = await queryContractPurchaseById({ id: r })
        console.log(data.contractPurchaseSignItemVOS)
        this.querydetails = data
      } catch (err) {
        console.log(err)
      }
    },
    close() {
      this.$router.go(-1)
    },
    sum_price(priceWithTax, taxRate) {
      // 未税单价
      let num = 0
      if (priceWithTax && taxRate) {
        num = (Number(priceWithTax) / (1 + Number(taxRate) / 100)).toFixed(2)
      }
      return num
    },
    sum_total(contractMaterialNum, priceWith, biddingNum) {
      // 未税金额
      let num = 0
      if (contractMaterialNum && priceWith && biddingNum) {
        num = (Number(contractMaterialNum) * Number(priceWith)).toFixed(2) * biddingNum
      }
      return num
    },
    sumTotal(contractMaterialNum, priceWithTax) {
      // 含税金额
      let num = 0
      if (contractMaterialNum && priceWithTax) {
        num = (Number(contractMaterialNum) * Number(priceWithTax)).toFixed(2)
      }
      return num
    }
  },
  mounted() {
    this.queryContractPurchaseById()
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  .closebutton {
    text-align: center;
    .close {
      margin: 15px 0;
    }
  }
}
</style>
