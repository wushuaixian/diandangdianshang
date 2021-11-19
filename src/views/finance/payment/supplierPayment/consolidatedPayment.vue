<template>
  <div>
    <a-modal title="合并付款" width="800px" :visible="visible" :footer="null" @cancel="handleCancel">
      <h3 class="title">合并支付中请不要关闭页面等待结果</h3>
      <h3 v-if="successStatus" class="title">
        合并付款{{ number.total }}条,失败{{ number.fial }}条, 成功{{ number.success }}条
      </h3>
      <s-table
        v-if="visible"
        rowKey="id"
        ref="table"
        name="homePageTables"
        :scroll="{ x: 2000 }"
        :columns="columns"
        :data="init"
      >
        <template slot="payStatus" slot-scope="text">
          <span>{{ text.payStatus === 0 ? '成功' : '失败' }}</span>
        </template>
        <template slot="payAmount" slot-scope="record">
          <span>{{ record.payAmount | formatCurrency(2, true) }}</span>
        </template>
      </s-table>
      <div class="footer">
        <a-button @click="handleCancel">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mergePaymentList } from '@/api/fince'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mergePaymentBillCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      number: {
        fial: 0,
        success: 0,
        total: 0
      },
      successStatus: false,
      columns: [
        {
          title: '付款单号',
          key: 'paymentBillCode',
          dataIndex: 'paymentBillCode'
        },
        {
          title: '交易类型',
          key: 'sceneType',
          dataIndex: 'sceneType'
        },
        {
          title: '摘要',
          key: 'summary',
          dataIndex: 'summary'
        },
        {
          title: '付款金额(元)',
          key: 'payAmount',
          scopedSlots: { customRender: 'payAmount' }
        },
        {
          title: '收款单位',
          key: 'receiveUnit',
          dataIndex: 'receiveUnit'
        },
        {
          title: '支付流水号',
          key: 'paymentOrderId',
          dataIndex: 'paymentOrderId'
        },
        {
          title: '支付状态',
          key: 'payStatus',
          scopedSlots: { customRender: 'payStatus' }
        }
      ]
    }
  },
  methods: {
    async init() {
      const data = {
        sceneType: 15,
        paymentMethod: 2,
        mergePaymentBillCode: this.mergePaymentBillCode,
        frontUrl: 'http://www.baidu.com',
        payerType: 2
      }
      const res = mergePaymentList({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.number = res.data
          this.successStatus = true
        }
      })
      return res
    },
    handleCancel() {
      this.$emit('close')
      this.$router.push({ name: 'SysPaymentManage' })
    }
  }
}
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  text-align: right;
  margin-top: 10px;
}
.cursor {
  cursor: pointer;
  color: #ff6b00;
}
.title {
  text-align: center;
}
</style>
