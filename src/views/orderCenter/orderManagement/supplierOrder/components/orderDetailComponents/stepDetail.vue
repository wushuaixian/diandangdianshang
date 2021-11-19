<!--
 * @Author: your name
 * @Date: 2021-07-17 15:43:27
 * @LastEditTime: 2021-08-07 14:15:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderDetailComponents/stepDetail.vue
-->
<template>
  <div>
    <a-steps class="step-class" labelPlacement="vertical" :current="current">
      <a-step v-for="(item, index) in step" :key="index" :title="item.stepTitle" :description="item.createTime" />
    </a-steps>
    <div class="title-top">
      <div class="title-left">
        <div class="text">状态</div>
        <div class="status">
          {{ orderDetail.orderStatusJson[orderDetailJson.orderStatus] }}
        </div>
        <div class="btn">
          <span
            v-for="(i, index) in orderDetail.orderDetailBtn.filter((record) => {
              return record.status.includes(orderDetailJson.orderStatus)
            })"
            :key="index"
          >
            <a-button :type="i.type" @click="clickFunction(i.function)">{{ i.text }}</a-button>
          </span>
        </div>
      </div>
      <div class="title-right">
        <a-row class="order-top">
          <a-col :span="8">
            <span class="order-code">订单编号: {{ orderDetailJson.orderCode }}</span>
          </a-col>
          <a-col :span="8">
            <span class="order-code">外部订单号: {{ orderDetailJson.outOrderCode }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">订单类型: {{ orderDetail.orderTypeJson[orderDetailJson.orderType] }}</a-col>
          <a-col :span="8">商家: {{ orderDetailJson.merchantName }}</a-col>
          <a-col :span="8">店铺: {{ orderDetailJson.storeName }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="8">订单来源: {{ orderDetailJson.purchaseOrderSourceStr }}</a-col>
          <a-col :span="8">来源: {{ orderDetailJson.orderChannelStr }}</a-col>
        </a-row>
      </div>
    </div>
    <batchConfirmationModal ref="batchConfirmationModal"></batchConfirmationModal>
  </div>
</template>
<script>
import batchConfirmationModal from './batchConfirmationModal'
import { orderDetail } from '@/config/orderStatus'
import { updateStatus } from '@/api/orderCenter'
export default {
  props: {
    orderDetailJson: {
      type: Object,
      default: () => {
        return {}
      }
    },
    step: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    batchConfirmationModal
  },
  data() {
    return {
      current: 0,
      orderDetail
    }
  },
  methods: {
    batchConfirmation() {
      this.$refs.batchConfirmationModal.init([this.orderDetailJson.orderCode])
    },
    clickFunction(fn) {
      this[fn]()
    },
    sureOrder() {
      console.log('确认订单')
      const vm = this
      this.$confirm({
        title: '确认订单',
        okText: '确认订单',
        cancelText: '订单驳回',
        // content: `导出任务创建成功,任务编码: ${result.data}`,
        async onOk() {
          const result = await updateStatus({
            orderStatus: 1031,
            orderCode: vm.$route.params.id
          })
          if (result.code === '0') {
            vm.$message.success('订单确认成功')
            vm.$emit('resetOrder')
            // vm.$refs.orderListTable.refresh(true)
          }
        },
        async onCancel() {
          const result = await updateStatus({
            orderStatus: 1032,
            orderCode: vm.$route.params.id
          })
          if (result.code === '0') {
            vm.$message.success('订单驳回成功')
            vm.$emit('resetOrder')
            // vm.$refs.orderListTable.refresh(true)
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.step-class {
  padding-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e5e5;
}
.title-top {
  display: flex;
  padding: 24px;
  padding-bottom: 0px;
  .title-left {
    width: 260px;
    border-right: 1px solid #e5e5e5;
    text-align: center;
    .text {
      font-weight: 400;
      color: #666666;
    }
    .status {
      font-size: 20px;
      font-weight: 600;
      color: #262626;
      margin-top: 16px;
    }
    .btn {
      margin-top: 16px;
    }
  }
  .title-right {
    flex: 1;
    padding-left: 24px;
    /deep/ .ant-row {
      margin-bottom: 24px;
    }
    .order-top {
      .order-code {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
    }
  }
}
</style>
