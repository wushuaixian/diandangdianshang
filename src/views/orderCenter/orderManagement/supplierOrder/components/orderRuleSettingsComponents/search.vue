<!--
 * @Author: your name
 * @Date: 2021-07-16 17:33:29
 * @LastEditTime: 2021-08-02 12:32:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/listSearch.vue
-->

<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" ref="form" :model="queryParams">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规则编码" prop="code">
              <a-input placeholder="请输入规则编码" v-model="queryParams.code" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规则名称" prop="name">
              <a-input placeholder="请输入规则名称" v-model="queryParams.name" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="审核原因" prop="reason">
              <d-select v-model="queryParams.reason" :options="reasonList"></d-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规则适用商家" prop="merchantId">
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                show-search
                placeholder="请输入规则适用商家"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                v-model="queryParams.merchantId"
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
            <a-form-model-item label="状态" prop="isDisable">
              <d-select v-model="queryParams.isDisable" :options="isDisableList"></d-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-col :md="24" :sm="24">
          <div class="button">
            <a-button type="primary" @click="ok">查询</a-button>
            <a-button class="reset" @click="reset">重置</a-button>
          </div>
        </a-col>
      </a-form-model>
    </div>
  </div>
</template>
<script>
import { searchCom } from '@/api/contract'
let timeout
export default {
  data() {
    return {
      queryParams: {},
      // labelCol: { span: 8 },
      // wrapperCol: { span: 16 },
      rules: {},
      supList: [],
      fetching: false,
      isDisableList: [
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '停用'
        }
      ],
      reasonList: [
        {
          value: '1',
          label: '订单有备注'
        },
        {
          value: '2',
          label: '价格与套价不服'
        },
        {
          value: '3',
          label: '有过人工改价'
        },
        {
          value: '4',
          label: '其他'
        }
      ]
    }
  },
  methods: {
    ok() {
      this.$emit('search', this.queryParams)
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startOrderCreateTime = startTime + ' 00:00:00'
      this.queryParams.endOrderCreateTime = endTime + ' 23:59:59'
    },
    reset() {
      this.$refs.form.resetFields()
      this.queryParams.merchantId = null
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
