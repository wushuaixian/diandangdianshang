<!--
 * @Author: your name
 * @Date: 2021-07-19 17:25:37
 * @LastEditTime: 2021-08-02 21:29:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderDetailComponents/receivingInformation.vue
-->
<template>
  <div>
    <div class="box">
      <!-- 收货信息 -->
      <div class="receivingInformation">
        <div class="title">收货信息</div>
        <div>下单账号: {{ orderDetailJson.userName }}</div>
        <div>收货人: {{ orderDetailJson.goodReceiverName }}</div>
        <div>
          收货地址: {{ orderDetailJson.goodReceiverProvince }} {{ orderDetailJson.goodReceiverCity }}
          {{ orderDetailJson.goodReceiverArea }} {{ orderDetailJson.goodReceiverAddress }}
        </div>
        <div>手机号: {{ orderDetailJson.goodReceiverMobile }}</div>
        <div>买家留言: {{ orderDetailJson.orderRemarkUser }}</div>
        <div>商家留言: {{ orderDetailJson.orderRemarkMerchant2user }}</div>
      </div>
      <!-- 配送信息 -->
      <div class="distributionInformation">
        <div class="title">配送信息</div>
        <div>配送方式: {{ orderDetailJson.orderDeliveryMethodStr }}</div>
        <div>运费: ¥{{ orderDetailJson.orderDeliveryFee || 0 | formatCurrency(2, true) }}</div>
        <!-- <div>期望到货时间:</div> -->
      </div>
      <!-- 订单金额信息 -->
      <div class="orderAmountInformation">
        <div class="title">订单金额信息</div>
        <div class="commit">
          <span>付款类型: {{ orderDetailJson.orderPaymentType === 1 ? '账期' : '分阶段' }}</span>
        </div>
        <div>支付方式: {{ payTypeJson[orderDetailJson.payType] }}</div>
        <!-- 支付时间。 801没有。等901上 -->
        <!-- <div>支付时间: {{ orderDetailJson.orderPaymentConfirmDate | moment('YYYY-MM-DD HH:mm:ss') }}</div> -->
      </div>
      <!-- 发票信息 -->
      <div class="invoiceInformation">
        <div class="title">发票信息</div>
        <div>打票类型: {{ orderDetailJson.invoiceType === 1 ? '普通发票' : '增值税发票' }}</div>
        <!-- <div class="commit">
          <span>开票状态: 未开票</span>
        </div> -->
        <div>
          发票邮寄地址: {{ orderDetailJson.soInvoiceDTO.goodReceiverProvince
          }}{{ orderDetailJson.soInvoiceDTO.goodReceiverCity }}{{ orderDetailJson.soInvoiceDTO.goodReceiverArea
          }}{{ orderDetailJson.soInvoiceDTO.goodReceiverAddress }}
        </div>
        <div>收件人: {{ orderDetailJson.goodReceiverName }}</div>
        <div>收货人联系方式: {{ orderDetailJson.goodReceiverMobile }}</div>
        <div class="commit">开票状态: <a @click="visible = true">发票信息</a></div>
      </div>
    </div>
    <a-modal title="发票信息" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <!-- <p>{{ ModalText }}</p> -->
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="发票类型">
          <span>{{ orderDetailJson.soInvoiceDTO.invoiceType === 1 ? '普通发票' : '增值税发票' }}</span>
        </a-form-model-item>
        <a-form-model-item label="发票抬头">
          <span>{{ orderDetailJson.soInvoiceDTO.invoiceTitleContent }}</span>
        </a-form-model-item>
        <a-form-model-item label="纳税人识别码">
          <span>{{ orderDetailJson.soInvoiceDTO.taxpayerIdentificationCode }}</span>
        </a-form-model-item>
        <a-form-model-item label="地址">
          <span>{{ orderDetailJson.soInvoiceDTO.registerAddress }}</span>
        </a-form-model-item>
        <a-form-model-item label="电话">
          <span>{{ orderDetailJson.soInvoiceDTO.registerPhone }}</span>
        </a-form-model-item>
        <a-form-model-item label="开户银行">
          <span>{{ orderDetailJson.soInvoiceDTO.bankDeposit }}</span>
        </a-form-model-item>
        <a-form-model-item label="银行账户">
          <span>{{ orderDetailJson.soInvoiceDTO.bankAccount }}</span>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    orderDetailJson: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      payTypeJson: {
        1: '电汇',
        2: '承兑汇票',
        3: '两者都是'
      },
      visible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="less">
.box {
  display: flex;
  // border: 1px solid #e5e5e5;
  .receivingInformation,
  .distributionInformation,
  .orderAmountInformation {
    flex: 1;
    // border-right: 1px solid #e5e5e5;
    padding: 10px;
    div {
      line-height: 28px;
    }
    .commit {
      width: 80%;
      display: flex;
      justify-content: space-between;
    }
  }
  .invoiceInformation {
    flex: 1;
    padding: 10px;
    div {
      line-height: 28px;
    }
    .commit {
      width: 80%;
      display: flex;
      justify-content: space-between;
    }
  }
  .title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>
