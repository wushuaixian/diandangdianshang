<!--
 * @Author: your name
 * @Date: 2021-07-16 17:33:29
 * @LastEditTime: 2021-08-01 20:37:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/listSearch.vue
-->
<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="queryParams">
          <!-- <a-row :gutter="48"> -->
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" prop="providerMerchantName">
                <!-- <a-input placeholder="请输入供应商" v-model="queryParams.providerMerchantName" /> -->
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入供应商名称查询"
                  v-model="queryParams.providerMerchantName"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input placeholder="请输入合同编号" v-model="queryParams.contractCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款方式" prop="paymentType">
                <!-- <a-input placeholder="请输入物料名称" v-model="queryParams.paymentType" /> -->
                <d-select v-model="queryParams.paymentType" :options="paymentTypeList"></d-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="启用状态" prop="isAvailable">
                <!-- <a-input placeholder="请输入规格型号" v-model="queryParams.isAvailable" /> -->
                <d-select v-model="queryParams.isAvailable" :options="isAvailableList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <!-- <a-input placeholder="请输入订单时间" v-model="queryParams.time" /> -->
                <a-range-picker v-model="queryParams.time" @change="onChangeEndAuditTime" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="订单来源" prop="purchaseOrderSource">
                <d-select v-model="queryParams.purchaseOrderSource" :options="purchaseOrderSourceList"></d-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款名称" prop="paymentName">
                <a-input placeholder="请输入付款名称" v-model="queryParams.paymentName" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="48" v-show="showMore">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款名称" prop="paymentName">
                <a-input placeholder="请输入付款名称" v-model="queryParams.paymentName" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <a-col :md="24" :sm="24">
            <div class="button">
              <a-button type="primary" @click="ok">查询</a-button>
              <a-button class="reset" @click="reset">重置</a-button>
              <!-- <span @click="showMore = !showMore" class="show-more">
                {{ showMore ? '收起' : '展开' }}
                <a-icon :style="{ color: '#ff6b00' }" :type="showMore ? 'up' : 'down'" />
              </span> -->
            </div>
          </a-col>
          <!-- </a-row> -->
        </a-form-model>
      </div>
    </a-card>
  </div>
</template>
<script>
import { paymentTypeList, isAvailableList } from './index.js'
import { searchCom } from '@/api/contract'
let timeout
export default {
  data() {
    return {
      paymentTypeList,
      isAvailableList,
      queryParams: {},
      showMore: false,
      supList: [],
      fetching: false,
      // labelCol: { span: 8 },
      // wrapperCol: { span: 16 },
      rules: {},
      purchaseOrderSourceList: [
        {
          value: '1',
          label: '计划'
        },
        {
          value: '2',
          label: '项目'
        },
        {
          value: '3',
          label: '合同'
        },
        {
          value: '4',
          label: '新增'
        }
      ]
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.resetForm()
    },
    ok() {
      this.$emit('search', this.queryParams)
    },
    resetForm() {
      this.queryParams.startDate = ''
      this.queryParams.endDate = ''
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startDate = startTime + ' 00:00:00'
      this.queryParams.endDate = endTime + ' 23:59:59'
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          this.fetching = false
          this.supList = ret.data.providerMerchantList
        })
      }, 300)
    }
  }
}
</script>
<style scoped>
.button {
  text-align: center;
  margin-top: 20px;
}
.show-more {
  margin-left: 16px;
  color: #ff6b00;
  font-size: 14px;
}
</style>
