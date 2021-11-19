<!--
 * @Author: your name
 * @Date: 2021-07-16 17:33:29
 * @LastEditTime: 2021-07-24 10:57:37
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
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input placeholder="请输入订单编号" v-model="queryParams.orderCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单时间" prop="time">
                <a-range-picker v-model="queryParams.time" @change="onChangeEndAuditTime" />
                <!-- ？？ -->
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购商" prop="buyerMerchantId">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入供应商名称查询"
                  v-model="queryParams.buyerMerchantId"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  @change="
                    (v) => {
                      queryParams.buyerMerchantId = Number(v)
                    }
                  "
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="materialName">
                <a-input placeholder="请输入物料名称" v-model="queryParams.materialName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="standard">
                <a-input placeholder="请输入规格型号" v-model="queryParams.standard" />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" prop="merchantId">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入供应商名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  v-model="queryParams.merchantId"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  @change="
                    (v) => {
                      queryParams.merchantId = Number(v)
                    }
                  "
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48" v-show="showMore">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input placeholder="请输入合同编号" v-model="queryParams.contractCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同名称" prop="contractName">
                <a-input placeholder="请输入合同名称" v-model="queryParams.contractName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购员" prop="buyerUserName">
                <a-input placeholder="请输入采购员" v-model="queryParams.buyerUserName" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48" v-show="showMore">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="项目名称" prop="projectName">
                <a-input placeholder="请输入项目名称" v-model="queryParams.projectName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单来源" prop="purchaseOrderSource">
                <a-select
                  v-model="queryParams.purchaseOrderSource"
                  default-value="全部"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :options="orderSourceList"
                  :key="dataKey"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-col :md="24" :sm="24">
            <div class="button">
              <a-button type="primary" @click="ok">查询</a-button>
              <a-button class="reset" @click=";[$refs.form.resetFields(), resetForm()]">重置</a-button>
              <span @click="showMore = !showMore" class="show-more">
                {{ showMore ? '收起' : '展开' }}
                <a-icon :style="{ color: '#ff6b00' }" :type="showMore ? 'up' : 'down'" />
              </span>
            </div>
          </a-col>
          <!-- </a-row> -->
        </a-form-model>
      </div>
    </a-card>
  </div>
</template>
<script>
import { searchCom } from '@/api/contract'
let timeout
export default {
  data() {
    return {
      supList: [],
      dataKey: 1,
      fetching: false,
      queryParams: {
        orderCode: '',
        time: null,
        merchantId: [],
        buyerMerchantId: [],
        materialName: '',
        standard: '',
        contractCode: '',
        buyerUserName: '',
        projectName: '',
        purchaseOrderSource: ''
      },
      orderSourceList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '计划',
          value: '1'
        },
        {
          label: '项目',
          value: '3'
        },
        {
          label: '合同',
          value: '4'
        },
        {
          label: '新增',
          value: '5'
        }
        // {
        //   label: '点选',
        //   value: 5
        // }
      ],
      showMore: false,
      // labelCol: { span: 8 },
      // wrapperCol: { span: 16 },
      rules: {}
    }
  },
  methods: {
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
          this.supList = ret.data.buyerMerchantList
          console.log(this.supList)
        })
      }, 300)
    },
    ok() {
      this.$emit('search', this.queryParams)
    },
    resetForm() {
      this.queryParams.startOrderCreateTime = ''
      this.queryParams.endOrderCreateTime = ''
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startOrderCreateTime = startTime + ' 00:00:00'
      this.queryParams.endOrderCreateTime = endTime + ' 23:59:59'
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
