<!--
 * @Author: your name
 * @Date: 2021-07-29 20:30:55
 * @LastEditTime: 2021-08-05 16:36:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/components/accounting.vue
-->
<template>
  <div>
    <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="结算账期类型" prop="paymentDaysType">
        <d-select v-model="queryParams.paymentDaysType" :options="paymentDaysTypeList"></d-select>
      </a-form-model-item>
      <a-form-model-item label="选择时间" prop="day" v-if="[1, 2].includes(queryParams.paymentDaysType)">
        <a-cascader
          :options="option[queryParams.paymentDaysType]"
          placeholder="请选择"
          :value="[queryParams.month, queryParams.day]"
          @change="handleChangeMonth"
        />
        <a-input-number
          style="width: 100%"
          v-if="queryParams.paymentDaysType === 6"
          placeholder="请输入"
          :formatter="(value) => `${value}天`"
          v-model="queryParams.day"
        ></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="选择时间" prop="month" v-if="[3, 4].includes(queryParams.paymentDaysType)">
        <a-cascader
          :options="option[queryParams.paymentDaysType]"
          placeholder="请选择"
          :value="[queryParams.month, queryParams.day]"
          @change="handleChangeMonth"
        />
      </a-form-model-item>
      <a-form-model-item label="选择时间" prop="day" v-if="queryParams.paymentDaysType === 6">
        <a-input-number
          style="width: 100%"
          placeholder="请输入"
          :formatter="(value) => `${value}天`"
          :max="36500"
          :min="0"
          v-model="queryParams.day"
        ></a-input-number>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { searchCom } from '@/api/contract'

let timeout
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    params() {}
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
      rules: {
        // providerMerchantId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        // paymentName: [{ required: true, message: '请填写账期结算名称', trigger: 'change' }],
        paymentDaysType: [{ required: true, message: '请选择账期结算类型', trigger: 'change' }],
        day: [{ required: true, message: '请选择天数', trigger: 'change' }],
        month: [{ required: true, message: '请选择天数', trigger: 'change' }]
      },
      queryParams: {
        paymentDaysType: 1
      },
      fetching: false,
      supList: [],
      option: { 1: [], 2: [], 3: [], 4: [] },
      // 1 每年 2 每季度 3 每月 4每周 5每日 6自定义
      paymentDaysTypeList: [
        {
          value: 1,
          label: '每年'
        },
        {
          value: 2,
          label: '每季度'
        },
        {
          value: 3,
          label: '每月'
        },
        {
          value: 4,
          label: '每周'
        },
        {
          value: 5,
          label: '每日'
        },
        {
          value: 6,
          label: '自定义'
        }
      ]
    }
  },
  mounted() {
    this.queryParams = this.params
    console.log(this.queryParams, 'queryParams')
    this.BindOption()
  },
  methods: {
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      const vm = this
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          vm.fetching = false
          vm.supList = ret.data.providerMerchantList
        })
      }, 300)
    },
    BindOption() {
      for (let i = 1; i <= 12; i++) {
        const children = []
        let days = 28
        if ([1, 3, 5, 7, 8, 10, 12].includes(i)) days = 31
        else if ([4, 6, 9, 11].includes(i)) days = 30
        for (let j = 1; j <= days; j++) children.push({ value: j, label: `${j}号` })
        this.option[1].push({ value: i, label: `${i}月`, children: children })
      }
      for (let i = 1; i <= 4; i++) {
        const children = []
        for (let j = 1; j <= 28; j++) children.push({ value: j, label: `${j}号` })
        this.option[2].push({ value: i, label: `第${i}个季度`, children: children })
      }
      for (let i = 1; i <= 28; i++) {
        this.option[3].push({ value: i, label: `${i}号` })
      }
      for (let i = 1; i <= 7; i++) {
        const week = ['一', '二', '三', '四', '五', '六', '日']
        this.option[4].push({ value: i, label: `周${week[i - 1]}` })
      }
    },
    handleChangeMonth(v) {
      this.$set(this.queryParams, 'month', v[0] || null)
      this.$set(this.queryParams, 'day', v[1] || null)
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-form-item {
  display: flex;
}
/deep/ .ant-form-item-control-wrapper {
  width: 40%;
}
</style>
