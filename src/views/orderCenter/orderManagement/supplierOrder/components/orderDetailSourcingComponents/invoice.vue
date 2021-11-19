<template>
  <div class="add-order-basic" v-if="form.newForm.soInvoiceDTO !== null">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form1" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-model-item label="发票类型" prop="invoiceType">
                <span v-if="form.newForm.soInvoiceDTO.invoiceType === 1">普通发票</span>
                <span v-else-if="form.newForm.soInvoiceDTO.invoiceType === 2">增值税发票</span>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="发票抬头" prop="paymentMethod">
                <span class="limit">{{ form.newForm.soInvoiceDTO.invoiceTitleContent }}</span></a-form-model-item
              >
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="纳税人识别号" prop="paymentMethod">
                {{ form.newForm.soInvoiceDTO.taxpayerIdentificationCode }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="地址" prop="paymentMethod">
                <span class="limit" :title="form.newForm.soInvoiceDTO.registerAddress">{{
                  form.newForm.soInvoiceDTO.registerAddress
                }}</span></a-form-model-item
              >
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="电话" prop="paymentMethod">
                {{ form.newForm.soInvoiceDTO.registerPhone }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="开户银行" prop="paymentMethod">
                {{ form.newForm.soInvoiceDTO.bankDeposit }}
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="银行账号" prop="paymentMethod">{{
                form.newForm.soInvoiceDTO.bankAccount
              }}</a-form-model-item>
            </a-col>
            <a-col v-if="false" :md="8" :sm="24"><a-button type="primary" @click="Add">编辑</a-button></a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-modal :visible="visible" :width="600" @cancel="visible = false" :destroyOnClose="true" title="编辑发票信息">
      <template slot="footer">
        <a-button key="back" @click="visible = false"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="$refs[ref].Save()"> 保存 </a-button>
      </template>
      <!-- <add-invoice :ref="ref" :form="localform" @update="update" /> -->
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
// import AddInvoice from './addInvoice.vue'
export default {
  created() {
    // if (this.disableds) {
    // this.localform.id = this.form.manualOrderInvoiceVo.invoiceId
    // this.localform.invoiceType = this.form.manualOrderInvoiceVo.invoiceType || 1
    // this.localform.dutyParagraph = this.form.manualOrderInvoiceVo.dutyParagraph
    // this.localform.bankDeposit = this.form.manualOrderInvoiceVo.bankDeposit
    // this.localform.bankAccount = this.form.manualOrderInvoiceVo.bankAccount
    // this.localform.buyerTel = this.form.manualOrderInvoiceVo.buyerTel
    // this.localform.detailAddress = this.form.manualOrderInvoiceVo.detailAddress
    // this.localform.id = this.form.manualOrderInvoiceVo.invoiceId
    //   console.log(this.form)
    // } else {
    //   this.BindData()
    // }
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    disableds: {
      type: Boolean,
      default: false
    }
  },
  // components: { AddInvoice },
  data() {
    return {
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      visible: false,
      ref: `form${new Date().getTime().toString()}`,
      localform: {
        id: null, // 发票信息 id
        invoiceType: 1, // 1：普通发票 ；2 ：增值税发票
        bankDeposit: '', // 开户银行
        bankAccount: '', // 开户行账户
        invoiceTitle: '', // 发票抬头
        mobileNo: '', // 电话
        dutyParagraph: '', // 纳税人识别号
        detailAddress: '' // 注册地址
      }
    }
  },
  methods: {
    BindData() {
      api.getIncoiceList().then((res) => {
        if (res.code === '0') {
          if (res.data) {
            this.localform = res.data
            this.form.manualOrderInvoiceVo.invoiceType = res.data.invoiceType
            this.form.manualOrderInvoiceVo.invoiceId = res.data.id
            this.form.manualOrderInvoiceVo.dutyParagraph = res.data.dutyParagraph
            this.form.manualOrderInvoiceVo.bankDeposit = res.data.bankDeposit
            this.form.manualOrderInvoiceVo.bankAccount = res.data.bankAccount
            this.form.manualOrderInvoiceVo.buyerTel = res.data.mobileNo
            this.form.manualOrderInvoiceVo.detailAddress = res.data.detailAddress
          }
        }
      })
    },
    update() {
      this.BindData()
      this.visible = false
    },
    Add() {
      this.visible = true
    }
  }
}
</script>

<style lang="less">
.add-order-basic {
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item {
        .ant-form-item-label {
          width: 110px;
        }
      }
    }
  }
  .ant-card-body {
    padding-bottom: 0;
  }
}
.limit {
  width: 150px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
