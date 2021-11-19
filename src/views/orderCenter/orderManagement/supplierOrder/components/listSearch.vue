<!--
 * @Author: your name
 * @Date: 2021-07-16 17:33:29
 * @LastEditTime: 2021-08-06 21:28:17
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
              <a-form-model-item label="采购商" prop="buyerMerchantId">
                <!-- <a-input placeholder="请输入采购商" v-model="queryParams.merchantId" /> -->
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入采购商"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  v-model="queryParams.buyerMerchantId"
                  :default-value="queryParams.buyerMerchantId"
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
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input placeholder="请输入订单编号" v-model="queryParams.orderCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单时间" prop="time">
                <!-- <a-input placeholder="请输入订单时间" v-model="queryParams.time" /> -->
                <a-range-picker v-model="queryParams.time" @change="onChangeEndAuditTime" />
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
              <a-form-model-item label="订单来源" prop="purchaseOrderSource">
                <!-- <a-input placeholder="请输入订单来源" v-model="queryParams.purchaseOrderSource" /> -->
                <d-select v-model="queryParams.purchaseOrderSource" :options="purchaseOrderSourceList"></d-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="48"> -->
          <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="发货状态" prop="enterpriseName">
                <a-input placeholder="请输入发货状态" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
          <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="到货状态" prop="enterpriseName">
                <a-input placeholder="请输入到货状态" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
          <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="入库状态" prop="enterpriseName">
                <a-input placeholder="请输入入库状态" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
          <!-- </a-row> -->
          <a-row :gutter="48" v-show="showMore">
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="开票状态" prop="enterpriseName">
                <a-input placeholder="请输入开票状态" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="付款状态" prop="enterpriseName">
                <a-input placeholder="请输入付款状态" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input placeholder="请输入合同编号" v-model="queryParams.contractCode" />
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
import { searchCom } from '@/api/orderCenter'
let timeout
export default {
  data() {
    return {
      queryParams: {},
      showMore: false,
      // labelCol: { span: 8 },
      // wrapperCol: { span: 16 },
      rules: {},
      fetching: false,
      purchaseOrderSourceList: [
        {
          value: '1',
          label: '计划'
        },
        {
          value: '2',
          label: '待下单'
        },
        {
          value: '3',
          label: '项目'
        },
        {
          value: '4',
          label: '合同'
        },
        {
          value: '5',
          label: '新增'
        },
        {
          value: '6',
          label: '点选'
        }
      ]
    }
  },
  methods: {
    ok() {
      this.$emit('search', this.queryParams)
    },
    resetForm() {
      delete this.queryParams.startOrderCreateTime
      delete this.queryParams.endOrderCreateTime
      delete this.queryParams.purchaseOrderSource
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startOrderCreateTime = startTime + ' 00:00:00'
      this.queryParams.endOrderCreateTime = endTime + ' 23:59:59'
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      const vm = this
      timeout = setTimeout(() => {
        searchCom({ message: value, platformId: 6 }).then((ret) => {
          vm.fetching = false
          vm.supList = ret.data.buyerMerchantList
          // if (vm.queryParams.merchantId) {
          //   vm.queryParams.merchantName = vm.supList.filter((item) => {
          //     return item.id === vm.queryParams.merchantId
          //   })[0]?.orgName
          // } else {
          //   vm.queryParams.merchantName = vm.supList[0]?.orgName
          //   vm.queryParams.merchantId = vm.supList[0]?.id
          // }
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
