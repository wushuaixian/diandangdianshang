<template>
  <div class="add-order-basic" v-if="form !== null">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          layout="inline"
          ref="basicforms"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" prop="merchantId">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入供应商名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  @change="handleChangeCom"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="item in comList"
                    :merchantId="item.merchantId"
                    :merchantName="item.merchantName"
                    :storeId="item.storeId"
                    :storeName="item.storeName"
                    :key="item.merchantId"
                    :value="item.merchantId"
                  >
                    {{ item.merchantName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系人" prop="contact">
                <a-input v-model="form.contact" placeholder="请输入联系人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系方式" prop="contactInformation">
                <a-input v-model="form.contactInformation" placeholder="请输入联系方式"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="是否优质优价" prop="isQuality">
                <a-radio-group v-model="form.isQuality">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="是否检斤检尺" prop="isJinGauging">
                <a-radio-group v-model="form.isJinGauging">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="下单备注" prop="customerRemark">
                <a-input v-model="form.customerRemark" placeholder="请输入下单备注"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="质保金(元)" prop="qualityRetentionMoney">
                <a-input v-model="form.qualityRetentionMoney" placeholder="请输入质保金(元)"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="质保期(月)" prop="qualityRetentionPeriod">
                <a-input v-model="form.qualityRetentionPeriod" placeholder="请输入质保期(月)"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="form.isJinGauging === 1">
              <a-form-model-item label="检斤开始时间" prop="jinGaugingStartDate">
                <a-date-picker v-model="form.jinGaugingStartDate" style="width: 100%" placeholder="请选择" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="form.isJinGauging === 1">
              <a-form-model-item label="检斤结束时间" prop="jinGaugingEndDate">
                <a-date-picker v-model="form.jinGaugingEndDate" style="width: 100%" placeholder="请选择" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
const rules = {
  merchantId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  contact: [{ required: true, message: '请填写联系人', trigger: 'change' }],
  contactInformation: [{ required: true, message: '请填写联系方式', trigger: 'change' }]
}
export default {
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules,
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      fetching: false,
      comList: []
    }
  },
  methods: {
    handleSearch(val) {
      this.fetching = true
      api.getComList(val).then((res) => {
        this.fetching = false
        if (res.code === '0') {
          this.comList = res.data
        }
      })
    },
    handleChangeCom(value, option) {
      this.form.merchantId = option?.data?.attrs?.merchantId
      this.form.merchantName = option?.data?.attrs?.merchantName
      this.form.storeId = option?.data?.attrs?.storeId
      this.form.storeName = option?.data?.attrs?.storeName
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
</style>
