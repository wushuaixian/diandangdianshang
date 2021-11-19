<!--
 * @Author: your name
 * @Date: 2021-07-18 11:35:11
 * @LastEditTime: 2021-08-05 19:38:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderApprovalListComponents/orderApprovalListSearch.vue
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
              <a-form-model-item label="下单会员账号" prop="userName">
                <a-input placeholder="请输入下单会员账号" v-model="queryParams.userName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="收货人姓名" prop="goodReceiverName">
                <a-input placeholder="请输入收货人姓名" v-model="queryParams.goodReceiverName" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="手机" prop="goodReceiverMobile">
                <a-input placeholder="请输入手机" v-model="queryParams.goodReceiverMobile" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="审核状态" prop="status">
                <d-select v-model="queryParams.status" :options="orderApprovalList.auditStatus"></d-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="auditTime">
                <a-range-picker v-model="queryParams.auditTime" @change="onChangeAuditTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="销售商家" prop="merchantId">
                <d-select v-model="queryParams.merchantId" :options="merchantIds"></d-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="订单状态" prop="orderStatus">
                <d-select v-model="queryParams.orderStatus" :options="orderApprovalList.orderStatus"></d-select>
              </a-form-model-item>
            </a-col> -->
          </a-row>
          <a-row :gutter="48">
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="异常时间" prop="endAuditTime">
                <a-range-picker v-model="queryParams.endAuditTime" @change="onChangeEndAuditTime" />
              </a-form-model-item>
            </a-col> -->
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="订单类型" prop="enterpriseName">
                <a-input placeholder="请输入订单类型" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="销售渠道" prop="enterpriseName">
                <a-input placeholder="请输入销售渠道" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核原因" prop="reason">
                <d-select v-model="queryParams.reason" :options="orderApprovalList.orderReason"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="下单时间" prop="orderCreateTime">
                <a-range-picker v-model="queryParams.orderCreateTime" @change="onChangeOrderCreateTime" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="48" v-show="showMore">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="销售渠道" prop="enterpriseName">
                <a-input placeholder="请输入销售渠道" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- <a-row :gutter="48" v-show="showMore">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="enterpriseName">
                <a-input placeholder="请输入审核时间" v-model="queryParams.enterpriseName" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <a-col :md="24" :sm="24">
            <div class="button">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button class="reset" @click=";[$refs.form.resetFields(), reset()]">重置</a-button>
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
import { orderApprovalList } from '@/config/orderStatus'
import { getUserMerchantInfo } from '@/api/orderCenter'
export default {
  data() {
    return {
      queryParams: {
        searchValue: 1
      },
      orderApprovalList,
      showMore: false,
      merchantIds: [],
      // labelCol: { span: 8 },
      // wrapperCol: { span: 16 },
      rules: {}
    }
  },
  async mounted() {
    await this.getUserMerchantInfoFn()
  },
  methods: {
    reset() {
      this.queryParams.startAuditCreateTime = ''
      this.queryParams.endAuditCreateTime = ''
      this.queryParams.startOrderCreateTime = ''
      this.queryParams.endOrderCreateTime = ''
      this.queryParams.startAuditTime = ''
      this.queryParams.endAuditTime = ''
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startAuditCreateTime = startTime + ' 00:00:00'
      this.queryParams.endAuditCreateTime = endTime + ' 23:59:59'
    },
    onChangeOrderCreateTime(val, [startTime, endTime]) {
      this.queryParams.startOrderCreateTime = startTime + ' 00:00:00'
      this.queryParams.endOrderCreateTime = endTime + ' 23:59:59'
    },
    onChangeAuditTime(val, [startTime, endTime]) {
      this.queryParams.startAuditTime = startTime + ' 00:00:00'
      this.queryParams.endAuditTime = endTime + ' 23:59:59'
    },
    async getUserMerchantInfoFn() {
      const {
        data: { merchantIds }
      } = await getUserMerchantInfo()
      for (const i in merchantIds) {
        this.merchantIds.push({ value: i, label: merchantIds[i] })
      }
    },
    search() {
      this.$emit('ok', this.queryParams)
    }
  }
}
</script>
<style scoped lang="less">
.button {
  text-align: center;
  margin-top: 20px;
}
.show-more {
  margin-left: 16px;
  color: #ff6b00;
  font-size: 14px;
}
/deep/ .d-select-wrapper {
  min-width: 30%;
}
/deep/ .ant-select-enabled {
  width: 100% !important;
}
/deep/ .ant-input-group {
  display: flex !important;
}
</style>
