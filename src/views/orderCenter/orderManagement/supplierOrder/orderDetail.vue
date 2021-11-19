<!--
 * @Author: your name
 * @Date: 2021-07-17 14:46:48
 * @LastEditTime: 2021-08-02 19:29:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/orderDetail.vue
-->
<template>
  <div>
    <a-card>
      <stepDetail
        v-if="stepInfo"
        :orderDetailJson="orderDetailJson"
        :step="stepInfo"
        @resetOrder="getOrderDetail"
      ></stepDetail>
    </a-card>
    <!-- <a-card class="logisticsInformation">
      <logisticsInformation></logisticsInformation>
    </a-card> -->
    <a-card class="logisticsInformation">
      <receivingInformation :orderDetailJson="orderDetailJson"></receivingInformation>
    </a-card>
    <a-card>
      <afterSale></afterSale>
    </a-card>
    <a-card>
      <div class="display-box">
        <div class="left">合计:</div>
        <div class="right">
          <div>商品总额: ¥{{ orderDetail.orderAmount || 0 | formatCurrency(2, true) }}</div>
          <div>优惠: ¥{{ orderDetail.orderPromotionDiscount || 0 | formatCurrency(2, true) }}</div>
          <div>
            运费: ¥{{ orderDetail.orderDeliveryFee || 0 | formatCurrency(2, true) }}
            <a-icon class="icon" type="edit" @click="$refs.freightModal.init(orderDetail.orderDeliveryFee || 0)" />
          </div>
          <div class="right-text">实付金额: ¥{{ orderDetail.orderAmount || 0 | formatCurrency(2, true) }}</div>
        </div>
      </div>
    </a-card>
    <freightModal ref="freightModal" @ok="updataNewFreight"></freightModal>
  </div>
</template>
<script>
import stepDetail from './components/orderDetailComponents/stepDetail' // 进度条
// import logisticsInformation from './components/orderDetailComponents/logisticsInformation' // 物流信息
import receivingInformation from './components/orderDetailComponents/receivingInformation' // 收货详情
import freightModal from './components/orderDetailComponents/freightModal'
import afterSale from './components/orderDetailComponents/afterSale' // 批量售后
import { orderDetail } from '@/config/orderStatus'
import { getSoDetail, modifyFreightPrice } from '@/api/orderCenter'
export default {
  components: {
    stepDetail,
    // logisticsInformation,
    receivingInformation,
    freightModal,
    afterSale
  },
  data() {
    return {
      orderCode: this.$route.params.id,
      orderDetail,
      orderDetailJson: {},
      stepInfo: []
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  methods: {
    // 修改运费
    async updataNewFreight(params) {
      const {
        orderDetailJson: { id }
      } = this
      const result = await modifyFreightPrice({
        id,
        orderDeliveryFee: Number(params)
      })
      if (result.code === '0') {
        this.$message.success('运费修改成功')
        this.getOrderDetail()
      }
    },
    async getOrderDetail() {
      const { orderCode } = this
      const result = await getSoDetail({
        orderCode
      })
      if (result.code === '0') {
        this.orderDetailJson = result.data.so
        this.stepInfo = [
          { stepTitle: '提交订单', createTime: result.data.so.orderCreateTime, current: 0 },
          { stepTitle: '支付完成', createTime: result.data.so.orderPaymentConfirmDate, current: 1 },
          { stepTitle: '商家发货', createTime: result.data.so.orderLogisticsTime, current: 2 },
          { stepTitle: '完成收货', createTime: result.data.so.orderReceiveDate, current: 3 },
          {
            stepTitle: '订单完成',
            createTime:
              result.data.so.orderStatus !== 9000 ? result.data.so.orderCompleteDate : result.data.so.orderCancelDate,
            current: 4
          }
        ]
      } else {
        this.$message.warning('订单详情查询错误')
        this.$router.back()
      }
    }
  }
}
</script>
<style scoped lang="less">
.logisticsInformation {
  // margin-top: 20px;
}
.display-box {
  display: flex;
  justify-content: flex-end;
  .left {
    margin-right: 20px;
  }
  .right {
    width: 200px;
    .icon {
      margin-left: 3px;
      cursor: pointer;
    }
    div {
      line-height: 30px;
    }
    .right-text {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
