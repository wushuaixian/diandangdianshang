<!--
 * @Author: your name
 * @Date: 2021-07-21 21:04:05
 * @LastEditTime: 2021-07-27 15:06:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/basicService/addBasicService/components/addServeAddress.vue
-->
<template>
  <div>
    <a-form-model :model="queryParams" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="OA服务器地址设置：">
        <a-input v-model="queryParams.oaUrl" :maxLength="100" />
      </a-form-model-item>
      <a-form-model-item label="ERP服务器地址设置：">
        <a-input v-model="queryParams.erpUrl" :maxLength="100" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit"> 保存 </a-button>
        <a-button style="margin-left: 10px" @click="$router.back()"> 返回 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { queryDetail } from '@/api/basicService'
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      queryParams: {}
    }
  },
  methods: {
    async init({ id }) {
      const result = await queryDetail({
        id
      })
      if (result.code === '0') {
        this.queryParams = result.data || {}
        this.$emit('getOrgId', result.data.merchantId)
      }
    },
    onSubmit() {
      const { queryParams } = this
      this.$emit('submit', queryParams)
    }
  }
}
</script>
<style scoped lang="less">
</style>
