<template>
  <div style="padding: 24px" v-if="form !== null">
    <a-form layout="inline">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-item label="采购单号">{{ form.orderCode || '' }}</a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="供应商">{{ form.merchantName }}</a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="创建时间">{{ form.createTime }}</a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="联系人"> {{ form.contact }} </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="联系电话">{{ form.contactInformation }}</a-form-item>
        </a-col>
        <a-col :md="8" :sm="24" v-if="form.purchaseOrderSource === 4">
          <a-form-item label="合同名称">
            <span>{{ form.extField3 || '无' }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24" v-if="form.purchaseOrderSource === 4">
          <a-form-item label="合同编号">
            <span>{{ form.extField4 || '无' }}</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24" v-if="form.purchaseOrderSource === 3">
          <a-form-item label="项目名称">{{ form.extField3 || '无' }}</a-form-item>
        </a-col>
        <a-col :md="8" :sm="24" v-if="form.purchaseOrderSource === 3">
          <a-form-item label="项目编号"> {{ form.extField4 || '无' }} </a-form-item>
        </a-col>
        <!-- <a-col :md="8" :sm="24" v-if="form.purchaseOrderSource === 1">
          <a-form-item label="采购计划编号"> {{ form.planItemCode || '无' }} </a-form-item>
        </a-col> -->
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
</style>
